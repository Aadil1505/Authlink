"use server";

import {
  NfcTagRegistrationResponse,
  BlockchainRegistrationResponse,
  ProductInfo,
  ProductRegistrationResponse,
  CompleteRegistrationResponse,
} from "@/types/registration";
import { db } from "../db";

/**
 * Server action to register a new NFC tag with the personalization endpoint
 * This function sends a request to the NFC backend to personalize a tag
 * with a verification URL that includes placeholders for UID, counter, and CMAC
 *
 * @returns {Promise<NfcTagRegistrationResponse>} The response from the NFC registration
 */
export async function registerNfcTag(): Promise<NfcTagRegistrationResponse> {
  // Get NFC backend URL from environment variable
  const nfcBackend = process.env.NFC_BACKEND || "http://localhost:3002/";

  // Build the full endpoint URL
  const endpoint = new URL("card/personalize", nfcBackend).toString();

  // Verification URL with placeholders for dynamic data
  // IMPORTANT: Using the exact URL format from your working curl example
  // const verificationUrl = "https://sdm.nfcdeveloper.com/tagpt?uid={uid}&ctr={counter}&cmac={cmac}";
  const verificationUrl = process.env.VERIFICATION_URL || "http://192.168.1.155:3000/verification?uid={uid}&ctr={counter}&cmac={cmac}";
  console.log("this is the verification url", verificationUrl)

  try {
    console.log("Server action: Calling NFC backend at:", endpoint);
    console.log("Server action: Using verification URL:", verificationUrl);

    // Send request to the NFC backend with the exact same payload as your working curl command
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: verificationUrl,
      }),
    });

    // Parse response as JSON
    const data = await response.json();
    console.log("Server action: NFC response data:", data);

    // Check if there was an error
    if (!response.ok || !data.success) {
      console.error("Server action: NFC registration failed:", data);
      return {
        success: false,
        error:
          data.error ||
          `NFC tag registration failed with status ${response.status}`,
      };
    }

    // Return successful response data
    return {
      success: true,
      uid: data.uid,
      isFactory: data.isFactory,
      message: data.message || "NFC tag successfully registered",
    };
  } catch (error) {
    // Handle any exceptions during the fetch operation
    console.error("Server action: Error registering NFC tag:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `NFC registration failed: ${error.message}`
          : "An unexpected error occurred during NFC registration",
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
  if (!nfcId || !productId) {
    return {
      success: false,
      error: "NFC ID and Product ID are required for blockchain registration",
    };
  }

  try {
    // API endpoint from environment variable or default to localhost
    const apiUrl = process.env.SOLANA_BACKEND || "http://localhost:3001";
    console.log("Server action: Registering on blockchain at:", apiUrl);
    console.log("Server action: With nfcId:", nfcId, "and productId:", productId);

    // Make the API request
    const response = await fetch(`${apiUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nfcId, productId }),
      cache: "no-store",
    });

    // Parse the response
    const data = await response.json();
    console.log("Server action: Blockchain registration response:", data);

    // Handle unsuccessful responses
    if (!response.ok || data.error) {
      console.error("Server action: Blockchain registration failed:", data);
      return {
        success: false,
        error: data.error || "Failed to register product on blockchain",
        details: data.details || [],
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
      owner: data.owner,
    };
  } catch (error) {
    console.error("Server action: Error registering product on blockchain:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Blockchain registration failed: ${error.message}`
          : "An unexpected error occurred during blockchain registration",
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
      error: "NFC UID and Product ID are required for database registration",
    };
  }

  try {
    console.log(
      `Server action: Registering NFC UID ${nfcUid} with product ${productInfo.productId}`
    );

    // Insert product into the products table
    const query = `
      INSERT INTO products (
        product_id,
        name,
        description,
        manufacturer_code,
        category,
        features,
        specifications,
        image_url,
        price,
        manufacture_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING id;
    `;
    const values = [
      productInfo.productId,
      productInfo.name,
      productInfo.description ?? null,
      productInfo.manufacturerCode,
      productInfo.category ?? null,
      productInfo.features ?? null,
      typeof productInfo.specifications === "string"
        ? productInfo.specifications
        : JSON.stringify(productInfo.specifications ?? {}),
      productInfo.image_url ?? null,
      productInfo.price ? Number(productInfo.price) : null,
    ];

    const result = await db.query(query, values);
    console.log("Server action: Database registration result:", result);

    // Optionally, you could also insert the NFC tag into a related table if needed

    return {
      success: true,
      message: `Successfully registered product ${productInfo.name} with NFC tag ${nfcUid} in database`,
    };
  } catch (error) {
    console.error("Server action: Error registering product with NFC tag in database:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? `Database registration failed: ${error.message}`
          : "An unexpected error occurred during database registration",
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
  console.log("Server action: Starting complete registration with product info:", productInfo);

  // Step 1: Register the NFC tag with the personalization endpoint
  const nfcRegistration = await registerNfcTag();
  console.log("Server action: NFC registration result:", nfcRegistration);

  // If NFC registration failed, return early with the error
  if (!nfcRegistration.success) {
    console.error("Server action: NFC registration failed, stopping registration process");
    return {
      success: false,
      error: nfcRegistration.error,
    };
  }

  // Step 2: Register on the blockchain
  const blockchainRegistration = await registerOnBlockchain(
    nfcRegistration.uid!,
    productInfo.productId
  );
  console.log("Server action: Blockchain registration result:", blockchainRegistration);

  // Step 3: Register the product with the NFC tag in the database
  // Only proceed with database registration if blockchain registration was successful
  let productRegistration: ProductRegistrationResponse;

  if (blockchainRegistration.success) {
    productRegistration = await registerProductWithNfc(
      nfcRegistration.uid!,
      productInfo
    );
    console.log("Server action: Product registration result:", productRegistration);
  } else {
    console.warn("Server action: Skipping database registration due to blockchain failure");
    productRegistration = {
      success: false,
      error:
        "Database registration skipped due to blockchain registration failure",
    };
  }

  // Return combined result with all three operations
  return {
    success: nfcRegistration.success,
    uid: nfcRegistration.uid,
    isFactory: nfcRegistration.isFactory,
    message: nfcRegistration.message,
    blockchainRegistration,
    productRegistration,
  };
}

export type { CompleteRegistrationResponse, ProductInfo, NfcTagRegistrationResponse, BlockchainRegistrationResponse, ProductRegistrationResponse };
