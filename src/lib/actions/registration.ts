'use server'

/**
 * Product information for registration
 */
export interface ProductInfo {
  productId: string;
  name: string;
  description?: string;
  manufacturerId: string;
}

/**
 * Response from NFC tag registration
 */
export interface NfcTagRegistrationResponse {
  success: boolean;
  uid?: string;
  isFactory?: boolean;
  message?: string;
  error?: string;
}

/**
 * Response from blockchain registration
 */
export interface BlockchainRegistrationResponse {
  success: boolean;
  message?: string;
  transaction?: string;
  productAccount?: string;
  nfcId?: string;
  productId?: string;
  owner?: string;
  error?: string;
  details?: string[];
}

/**
 * Response from database registration
 */
export interface ProductRegistrationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Response from complete registration process
 */
export interface CompleteRegistrationResponse {
  success: boolean;
  uid?: string;
  isFactory?: boolean;
  message?: string;
  error?: string;
  blockchainRegistration?: BlockchainRegistrationResponse;
  productRegistration?: ProductRegistrationResponse;
}

/**
 * Server action to register a new NFC tag with the personalization endpoint
 * This function sends a request to the NFC backend to personalize a tag
 * with a verification URL that includes placeholders for UID, counter, and CMAC
 * 
 * @returns {Promise<NfcTagRegistrationResponse>} The response from the NFC registration
 */
export async function registerNfcTag(): Promise<NfcTagRegistrationResponse> {
  // Get NFC backend URL from environment variable
  const nfcBackend = process.env.NFC_BACKEND || 'http://localhost:3002/';
  
  // Build the full endpoint URL
  const endpoint = new URL('card/personalize', nfcBackend).toString();
  
  // Verification URL with placeholders for dynamic data
  const verificationUrl = process.env.VERIFICATION_URL || 
    'http://10.25.130.96:3000/verification?uid={uid}&ctr={counter}&cmac={cmac}';
  
  try {
    // Send request to the NFC backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: verificationUrl
      }),
    });
    
    // Parse response as JSON
    const data = await response.json();
    
    // Check if there was an error
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `NFC tag registration failed with status ${response.status}`
      };
    }
    
    // Return successful response data
    return {
      success: true,
      uid: data.uid,
      isFactory: data.isFactory,
      message: data.message || 'NFC tag successfully registered'
    };
  } catch (error) {
    // Handle any exceptions during the fetch operation
    console.error('Error registering NFC tag:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? `NFC registration failed: ${error.message}` 
        : 'An unexpected error occurred during NFC registration'
    };
  }
}

/**
 * Server action to register a product on the blockchain
 * 
 * @param {string} nfcId - The NFC ID for the product
 * @param {string} productId - The unique product identifier
 * @returns {Promise<BlockchainRegistrationResponse>} Registration result
 */
export async function registerOnBlockchain(
  nfcId: string, 
  productId: string
): Promise<BlockchainRegistrationResponse> {
  // Validate inputs
  if (!nfcId || !productId) {
    return {
      success: false,
      error: 'NFC ID and Product ID are required for blockchain registration'
    };
  }

  try {
    // API endpoint from environment variable or default to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Make the API request
    const response = await fetch(`${apiUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nfcId, productId }),
      cache: 'no-store',
    });

    // Parse the response
    const data = await response.json();
    
    // Handle unsuccessful responses
    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Failed to register product on blockchain',
        details: data.details || []
      };
    }
    
    // Return successful response data
    return {
      success: true,
      message: `Successfully registered product on the blockchain`,
      transaction: data.transaction,
      productAccount: data.productAccount,
      nfcId: data.nfcId,
      productId: data.productId,
      owner: data.owner
    };
  } catch (error) {
    console.error('Error registering product on blockchain:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? `Blockchain registration failed: ${error.message}` 
        : 'An unexpected error occurred during blockchain registration'
    };
  }
}

/**
 * Server action to register product information in the database
 * 
 * @param {string} nfcUid - The UID of the NFC tag
 * @param {ProductInfo} productInfo - Product information to associate with this NFC tag
 * @returns {Promise<ProductRegistrationResponse>} The response from the product registration
 */
export async function registerProductWithNfc(
  nfcUid: string, 
  productInfo: ProductInfo
): Promise<ProductRegistrationResponse> {
  if (!nfcUid || !productInfo.productId) {
    return {
      success: false,
      error: 'NFC UID and Product ID are required for database registration'
    };
  }
  
  try {
    console.log(`Registering NFC UID ${nfcUid} with product ${productInfo.productId}`);
    
    // TODO: Implement the database registration logic here
    // Example using a database client:
    // await db.products.create({
    //   data: {
    //     id: productInfo.productId,
    //     name: productInfo.name,
    //     description: productInfo.description,
    //     manufacturerId: productInfo.manufacturerId,
    //     nfcTag: {
    //       create: {
    //         uid: nfcUid
    //       }
    //     }
    //   }
    // });
    
    // Simulate successful registration
    // Replace this with actual implementation
    return {
      success: true,
      message: `Successfully registered product ${productInfo.name} with NFC tag ${nfcUid} in database`
    };
  } catch (error) {
    console.error('Error registering product with NFC tag in database:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? `Database registration failed: ${error.message}` 
        : 'An unexpected error occurred during database registration'
    };
  }
}

/**
 * Combined function to handle all three steps of the registration process:
 * 1. NFC tag personalization
 * 2. Blockchain registration
 * 3. Database registration
 * 
 * @param {ProductInfo} productInfo - Product information to register
 * @returns {Promise<CompleteRegistrationResponse>} Complete registration result
 */
export async function registerComplete(
  productInfo: ProductInfo
): Promise<CompleteRegistrationResponse> {
  // Step 1: Register the NFC tag with the personalization endpoint
  const nfcRegistration = await registerNfcTag();
  
  // If NFC registration failed, return early with the error
  if (!nfcRegistration.success) {
    return {
      success: false,
      error: nfcRegistration.error
    };
  }
  
  // Step 2: Register on the blockchain
  const blockchainRegistration = await registerOnBlockchain(
    nfcRegistration.uid!, 
    productInfo.productId
  );
  
  // Step 3: Register the product with the NFC tag in the database
  // Only proceed with database registration if blockchain registration was successful
  let productRegistration: ProductRegistrationResponse;
  
  if (blockchainRegistration.success) {
    productRegistration = await registerProductWithNfc(
      nfcRegistration.uid!, 
      productInfo
    );
  } else {
    productRegistration = {
      success: false,
      error: "Database registration skipped due to blockchain registration failure"
    };
  }
  
  // Return combined result with all three operations
  return {
    success: nfcRegistration.success,
    uid: nfcRegistration.uid,
    isFactory: nfcRegistration.isFactory,
    message: nfcRegistration.message,
    blockchainRegistration,
    productRegistration
  };
}