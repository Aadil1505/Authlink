/**
 * Product information for registration
 */
export interface ProductInfo {
  productId: string;
  name: string;
  description?: string;
  manufacturerCode: string;
  category?: string;
  features?: string[];
  specifications?: Record<string, string> | string;
  image_url?: string;
  price?: string;
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
