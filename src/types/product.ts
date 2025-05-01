// types/product.ts

export interface ProductDetails {
    owner: string;
    nfcId: string;
    productId: string;
    productAccount: string;
  }
  
  export interface ProductResponse {
    success: boolean;
    product?: ProductDetails;
    error?: string;
    details?: string;
    nfcId?: string;
  }