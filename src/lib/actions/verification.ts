"use server";

import { ProductResponse } from "@/types/product";
import {
  VerificationResult,
  NfcData,
  BlockchainData,
  UserVerificationHistoryResult,
} from "@/types/verification";
import { auth } from "@/auth";
import { db } from "../db";

/**
 * Verifies a product using both NFC security protocol and blockchain verification.
 * Both verifications must pass for the combined result to be successful.
 *
 * @param uid - The unique ID of the NFC tag
 * @param ctr - The counter value from the NFC tag
 * @param cmac - The cryptographic message authentication code
 * @returns Promise with unified verification result
 */
export async function verifyTag(
  uid: string,
  ctr: string,
  cmac: string
): Promise<VerificationResult> {
  // Check for required parameters
  if (!uid || !ctr || !cmac) {
    return {
      success: false,
      nfcVerified: false,
      blockchainVerified: false,
      error: "Missing required parameters (uid, ctr, or cmac)",
    };
  }

  // Initialize result
  const result: VerificationResult = {
    success: false,
    nfcVerified: false,
    blockchainVerified: false,
  };

  try {
    // Step 1: Verify NFC tag with SDM
    const nfcVerification = await verifyNfcTag(uid, ctr, cmac);

    if ("error" in nfcVerification) {
      return {
        ...result,
        error: `NFC verification failed: ${nfcVerification.error}`,
      };
    }

    result.nfcVerified = true;
    result.nfcData = nfcVerification.result;

    // Step 2: Verify on blockchain
    const blockchainVerification = await verifyBlockchain(uid);

    if (
      !blockchainVerification.success ||
      !blockchainVerification.isAuthentic
    ) {
      return {
        ...result,
        blockchainData: blockchainVerification,
        error:
          "Blockchain verification failed: Product not found or not authentic",
      };
    }

    result.blockchainVerified = true;
    result.blockchainData = blockchainVerification;

    // Both verifications passed
    result.success = true;

    // Record the verification if successful
    if (result.success && result.blockchainData?.product?.productId) {
      await registerNewUserVerification(
        result.blockchainData.product.productId
      );
    }

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error during verification:", error);

    return {
      ...result,
      error: errorMessage,
    };
  }
}

/**
 * Response type for NFC tag verification
 */
type NfcVerificationResponse = { result: NfcData } | { error: string };

/**
 * Verifies an NFC tag using the SDM backend
 *
 * @param uid - The unique ID of the NFC tag
 * @param ctr - The counter value from the NFC tag
 * @param cmac - The cryptographic message authentication code
 * @returns Promise with NFC verification result or error
 */
async function verifyNfcTag(
  uid: string,
  ctr: string,
  cmac: string
): Promise<NfcVerificationResponse> {
  try {
    const sdmBackend = process.env.SDM_BACKEND;

    const apiUrl = `${sdmBackend}tagpt?uid=${uid}&ctr=${ctr}&cmac=${cmac}`;

    console.log("Calling NFC verification API:", apiUrl);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if ("error" in data) {
      return { error: data.error };
    }

    return { result: data as NfcData };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error verifying NFC tag:", error);

    return { error: errorMessage };
  }
}

/**
 * Verifies a product on the blockchain using its NFC ID
 *
 * @param nfcId - The NFC ID to verify on the blockchain
 * @returns Promise with blockchain verification result
 */
async function verifyBlockchain(nfcId: string): Promise<BlockchainData> {
  const apiBaseUrl = process.env.SOLANA_BACKEND;

  if (!apiBaseUrl) {
    return {
      success: false,
      isAuthentic: false,
      nfcId,
      //   error: "SOLANA_BACKEND environment variable is not defined"
    };
  }

  try {
    console.log(
      "Calling blockchain verification API:",
      `${apiBaseUrl}/api/products/verify/${nfcId}`
    );

    const response = await fetch(`${apiBaseUrl}/api/products/verify/${nfcId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to verify product on blockchain: ${response.status}`
      );
    }

    const verificationResult = (await response.json()) as BlockchainData;
    // console.log("result ", verificationResult, "result")

    // Fetch full product details if the tag is authentic
    if (verificationResult.isAuthentic) {
      const details = await getProductByNfcId(verificationResult.nfcId);
      // console.log("details here", details, "details here")

      if (details.success && details.product) {
        verificationResult.product = details.product;
      }
    }

    return verificationResult;
  } catch (error) {
    console.error("Error verifying product on blockchain:", error);

    return {
      success: false,
      isAuthentic: false,
      nfcId,
      //   error: error instanceof Error ? error.message : "An unknown error occurred"
    };
  }
}

/**
 * Fetches product details by NFC ID
 * @param nfcId - The NFC ID of the product to retrieve
 * @returns Promise<ProductResponse> - The response from the API
 */
export async function getProductByNfcId(
  nfcId: string
): Promise<ProductResponse> {
  try {
    const apiUrl = process.env.SOLANA_BACKEND;

    const response = await fetch(`${apiUrl}/api/products/${nfcId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // Parse the response
    const data: ProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);

    return {
      success: false,
      error: "Failed to fetch product details",
      details: error instanceof Error ? error.message : "Unknown error",
      nfcId,
    };
  }
}

export async function registerNewUserVerification(
  productId: string
): Promise<UserVerificationHistoryResult> {
  if (!productId) {
    return {
      success: false,
      error: "Product ID is required for database registration",
    };
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const query = `
      INSERT INTO user_verifications (
        product_id,
        user_id,
        verified_at
      ) VALUES ($1, $2, NOW())
      RETURNING id;
    `;

    const values = [productId, session.user.id];

    await db.query(query, values);

    return {
      success: true,
      message: "Verification recorded successfully",
    };
  } catch (error) {
    console.error("Error recording verification:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to record verification",
    };
  }
}
