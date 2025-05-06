/**
 * Type representing NFC tag data returned from the verification server
 */
export interface NfcData {
  uid: string;
  read_ctr: number;
  enc_mode: string;
}

/**
 * Type representing product data returned from the blockchain
 */
export interface ProductData {
  owner: string;
  nfcId: string;
  productId: string;
  productAccount: string;
}

/**
 * Type representing blockchain verification response
 */
export interface BlockchainData {
  success: boolean;
  isAuthentic: boolean;
  nfcId: string;
  productAccount?: string;
  product?: ProductData;
}

/**
 * Type representing the unified verification result
 */
export interface VerificationResult {
  success: boolean;
  nfcVerified: boolean;
  blockchainVerified: boolean;
  nfcData?: NfcData;
  blockchainData?: BlockchainData;
  error?: string;
}

export interface UserVerificationHistoryResult {
  success: boolean;
  message?: string;
  error?: string;
}
