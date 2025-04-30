// app/actions/verify.ts

'use server'

// Define response types
type NfcData = {
  uid: string;
  read_ctr: number;
  enc_mode: string;
}

type BlockchainData = {
  success: boolean;
  isAuthentic: boolean;
  productAccount?: string;
  nfcId: string;
  product?: {
    owner: string;
    nfcId: string;
    productId: string;
    productAccount: string;
  };
}

// Create a single unified verification result type
type VerificationResult = {
  success: boolean;
  nfcVerified: boolean;
  blockchainVerified: boolean;
  nfcData?: NfcData;
  blockchainData?: BlockchainData;
  error?: string;
}

/**
 * Verifies a product using both NFC security protocol and blockchain verification
 * Both verifications must pass for the combined result to be successful
 * 
 * @param uid - The unique ID of the NFC tag
 * @param ctr - The counter value from the NFC tag
 * @param cmac - The cryptographic message authentication code
 * @returns Promise with unified verification result
 */
export async function verifyTag(uid: string, ctr: string, cmac: string): Promise<VerificationResult> {
  // Check for required parameters
  if (!uid || !ctr || !cmac) {
    return { 
      success: false,
      nfcVerified: false,
      blockchainVerified: false,
      error: "Missing required parameters (uid, ctr, or cmac)" 
    };
  }
  
  // Initialize result
  const result: VerificationResult = {
    success: false,
    nfcVerified: false,
    blockchainVerified: false
  };

  try {
    // Step 1: Verify NFC tag with SDM
    const nfcVerification = await verifyNfcTag(uid, ctr, cmac);
    
    if ('error' in nfcVerification) {
      return { 
        ...result, 
        error: `NFC verification failed: ${nfcVerification.error}` 
      };
    }
    
    result.nfcVerified = true;
    result.nfcData = nfcVerification.result;

    // Step 2: Verify on blockchain
    const blockchainVerification = await verifyBlockchain(uid);
    
    if (!blockchainVerification.success || !blockchainVerification.isAuthentic) {
      return {
        ...result,
        blockchainData: blockchainVerification,
        error: "Blockchain verification failed: Product not found or not authentic"
      };
    }
    
    result.blockchainVerified = true;
    result.blockchainData = blockchainVerification;
    
    // Both verifications passed
    result.success = true;
    
    return result;
    
  } catch (err: any) {
    const errorMessage = err.message || "An unknown error occurred";
    console.error("Error during verification:", err);
    return { 
      ...result, 
      error: errorMessage 
    };
  }
}

/**
 * Verifies an NFC tag using the SDM backend
 */
async function verifyNfcTag(uid: string, ctr: string, cmac: string): Promise<{result: NfcData, error?: string} | {error: string}> {

    console.log("this is the uid ", uid)

  try {
    const apiUrl = `${process.env.SDM_BACKEND}tagpt?uid=${uid}&ctr=${ctr}&cmac=${cmac}`;
    
    console.log("Calling NFC verification API:", apiUrl);
    
    const response = await fetch(
      apiUrl, 
      { 
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if ('error' in data) {
      return { error: data.error };
    } else {
      return { result: data as NfcData };
    }
  } catch (err: any) {
    const errorMessage = err.message || "An unknown error occurred";
    console.error("Error verifying NFC tag:", err);
    return { error: errorMessage };
  }
}

/**
 * Verifies a product on the blockchain using its NFC ID
 */
async function verifyBlockchain(nfcId: string): Promise<BlockchainData> {
  const API_BASE_URL = process.env.SOLANA_BACKEND;
  
  try {
    console.log("Calling blockchain verification API:", `${API_BASE_URL}/products/verify/${nfcId}`);
    
    // Make API request to verify endpoint
    const response = await fetch(`${API_BASE_URL}/products/verify/${nfcId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify product on blockchain');
    }
    
    const verificationResult: BlockchainData = await response.json();
    
    // If product is authentic, fetch additional details
    if (verificationResult.isAuthentic) {
      const detailsResponse = await fetch(`${API_BASE_URL}/products/${nfcId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        if (detailsResult.success) {
          verificationResult.product = detailsResult.product;
        }
      }
    }
    console.log(verificationResult)

    
    return verificationResult;
    
  } catch (error) {
    console.error('Error verifying product on blockchain:', error);
    return {
      success: false,
      isAuthentic: false,
      nfcId
    };
  }
}