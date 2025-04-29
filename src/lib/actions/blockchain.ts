'use server'

type BlockchainVerificationResult = {
  success: boolean;
  isAuthentic: boolean;
  productAccount?: string;
  nfcId: string;
  error?: string;
  product?: {
    owner: string;
    nfcId: string;
    productId: string;
    productAccount: string;
  };
};

/**
 * Server action to verify a product's authenticity using its NFC ID
 * This function calls the Authlink Solana backend API and returns verification result
 * 
 * @param nfcId - The unique NFC identifier of the product to verify
 * @returns Promise containing verification result with authentication status
 */
export async function blockchainVerifyProduct(nfcId: string): Promise<BlockchainVerificationResult> {
  // API base URL (should be in your environment variables)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
  
  try {
    // Validate input
    if (!nfcId) {
      throw new Error('NFC ID is required');
    }
    
    // Make API request to verify endpoint
    const response = await fetch(`${API_BASE_URL}/products/verify/${nfcId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Ensure latest data is fetched (not cached)
    //   next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify product');
    }
    
    const verificationResult: BlockchainVerificationResult = await response.json();
    
    // If product is authentic, fetch additional details
    if (verificationResult.isAuthentic) {
      const detailsResponse = await fetch(`${API_BASE_URL}/products/${nfcId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // next: { revalidate: 0 }
      });
      
      if (detailsResponse.ok) {
        const detailsResult = await detailsResponse.json();
        if (detailsResult.success) {
          verificationResult.product = detailsResult.product;
        }
      }
    }
    
    return verificationResult;
    
  } catch (error) {
    console.error('Error verifying product:', error);
    return {
      success: false,
      isAuthentic: false,
      nfcId,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}