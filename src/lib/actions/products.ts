"use server";
import { db } from "../db";

// Blockchain API endpoints
const BLOCKCHAIN_API = {
  baseUrl: "http://localhost:3001/api",
  health: "/health",
  register: "/products",
  verify: (nfcId: string) => `/products/verify/${nfcId}`,
  details: (nfcId: string) => `/products/${nfcId}`,
  list: "/products",
};

interface Product {
  id: number;
  product_id: string;
  name: string;
  description?: string;
  manufacturer_id: number;
  created_at: Date;
}

interface BlockchainRegistrationResponse {
  success: boolean;
  transaction?: string;
  productAccount?: string;
  nfcId: string;
  productId: string;
  owner?: string;
  error?: string;
  logs?: string[];
}

interface BlockchainRegistrationResult {
  success: boolean;
  error?: string;
  transactionHash: string;
  productAccount?: string;
  owner?: string;
}

interface BlockchainVerificationResult {
  verified: boolean;
  productId?: string;
  error?: string;
}

// Retry configuration
const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
};

// Error types
interface BlockchainError {
  logs: BlockchainErrorLog[];
  message: string;
}

interface BlockchainErrorLog {
  message: string;
  programId: string;
  level: "error" | "warn" | "info" | "debug";
}

interface BlockchainErrorResponse {
  error?: {
    message: string;
  };
  logs?: BlockchainErrorLog[];
}

interface BlockchainRegistrationError extends Error {
  logs?: string[];
}

// Helper function to wait with exponential backoff
async function wait(attempt: number) {
  const delay = Math.min(
    RETRY_CONFIG.initialDelay * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelay
  );
  await new Promise((resolve) => setTimeout(resolve, delay));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  isRetryable: (error: BlockchainError | unknown) => boolean
): Promise<T> {
  let lastError: BlockchainError | unknown;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!isRetryable(error)) {
        throw error;
      }

      // On last attempt, throw the error
      if (attempt === RETRY_CONFIG.maxAttempts - 1) {
        throw new Error(
          `Failed after ${RETRY_CONFIG.maxAttempts} attempts. Last error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Wait with exponential backoff before retrying
      await wait(attempt);
    }
  }

  throw lastError;
}

// Helper to determine if an error is retryable
function isRetryableError(error: BlockchainError | unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Network errors or timeouts
  if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
    return true;
  }

  // Solana-specific retryable errors
  if (
    errorMessage.includes("Transaction failed to sanitize") ||
    errorMessage.includes("blockhash not found") ||
    errorMessage.includes("block height exceeded") ||
    errorMessage.includes("insufficient funds for transaction") ||
    errorMessage.includes("rate limit exceeded")
  ) {
    return true;
  }

  return false;
}

// Database Operations
export async function getProductById(prodId: string, manufacturerCode: string) {
  const query = `
    SELECT p.*, u.manufacturer_code 
    FROM products p
    JOIN users u ON p.manufacturer_id = u.id
    WHERE p.product_id = $1 AND u.manufacturer_code = $2;
  `;

  try {
    const values = [prodId, manufacturerCode];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error retrieving product from database:", error);
    throw error;
  }
}

export async function getAllProducts(manufacturerCode: string) {
  try {
    const query = `
      SELECT p.*, u.manufacturer_code
      FROM products p
      JOIN users u ON p.manufacturer_id = u.id
      WHERE u.manufacturer_code = $1
      ORDER BY p.created_at DESC;
    `;

    const result = await db.query(query, [manufacturerCode]);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving products from database:", error);
    throw error;
  }
}

// Blockchain Operations
export async function checkBlockchainHealth() {
  try {
    const response = await fetch(
      BLOCKCHAIN_API.baseUrl + BLOCKCHAIN_API.health
    );
    if (!response.ok) {
      throw new Error("Blockchain service is not healthy");
    }
    const data = await response.json();
    return {
      status: "healthy",
      timestamp: new Date(),
      network: data.solana?.network,
      programId: data.programId,
      walletAddress: data.walletAddress,
    };
  } catch (error) {
    console.error("Health check failed:", error);
    throw new Error(
      error instanceof Error
        ? `Blockchain service error: ${error.message}`
        : "Blockchain service connection failed"
    );
  }
}

function parseBlockchainError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "An unknown error occurred while registering the product.";
  }

  const errorResponse = error as BlockchainErrorResponse;
  const logs = errorResponse.logs || [];
  const errorObj = errorResponse.error?.message || "";

  // Check for specific error conditions
  if (
    logs.some((log: BlockchainErrorLog) =>
      log.message.includes("already in use")
    )
  ) {
    return "This NFC ID is already registered. Please use a different NFC tag.";
  }
  if (errorObj.includes("custom program error: 0x0")) {
    if (
      logs.some((log: BlockchainErrorLog) =>
        log.message.includes("Allocate: account")
      )
    ) {
      return "This NFC ID is already registered. Please use a different NFC tag.";
    }
    return "Failed to initialize product on blockchain. Please try again.";
  }

  return "Failed to register product on blockchain. Please try again.";
}

async function registerWithBlockchain({
  nfcId,
  productId,
}: {
  nfcId: string;
  productId: string;
}): Promise<BlockchainRegistrationResult> {
  try {
    // First validate the NFC ID format
    if (!nfcId.match(/^NFC-424-\d{3}$/)) {
      return {
        success: false,
        error:
          "Invalid NFC ID format. Must be in format NFC-424-XXX where X is a digit",
        transactionHash: "",
      };
    }

    // Wrap the blockchain registration in retry logic
    const result = await retryWithBackoff<BlockchainRegistrationResponse>(
      async () => {
        const response = await fetch(
          BLOCKCHAIN_API.baseUrl + BLOCKCHAIN_API.register,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nfcId,
              productId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          const error = new Error(
            data.error || "Failed to register with blockchain"
          ) as BlockchainRegistrationError;
          error.logs = data.logs;
          throw error;
        }

        return data;
      },
      // Only retry if it's not an "already registered" error
      (error) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const logs = (error as BlockchainRegistrationError)?.logs || [];
        return (
          isRetryableError(error) &&
          !logs.some((log: string) => log.includes("already in use")) &&
          !errorMessage.includes("already in use")
        );
      }
    );

    return {
      success: true,
      transactionHash: result.transaction || "",
      productAccount: result.productAccount,
      owner: result.owner,
    };
  } catch (error) {
    console.error("Blockchain registration error:", error);
    return {
      success: false,
      error: parseBlockchainError(error),
      transactionHash: "",
    };
  }
}

export async function verifyProductOnBlockchain(
  nfcId: string
): Promise<BlockchainVerificationResult> {
  try {
    const result = await retryWithBackoff(async () => {
      const response = await fetch(
        BLOCKCHAIN_API.baseUrl + BLOCKCHAIN_API.verify(nfcId)
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    }, isRetryableError);

    return {
      verified: true,
      productId: result.productId,
    };
  } catch (error) {
    console.error("Blockchain verification error:", error);
    return {
      verified: false,
      error:
        error instanceof Error ? error.message : "Failed to verify product",
    };
  }
}

export async function getBlockchainProductDetails(nfcId: string) {
  return retryWithBackoff(async () => {
    const response = await fetch(
      BLOCKCHAIN_API.baseUrl + BLOCKCHAIN_API.details(nfcId)
    );

    if (!response.ok) {
      throw new Error("Failed to get product details from blockchain");
    }

    return response.json();
  }, isRetryableError);
}

// Combined Registration (Database + Blockchain)
export async function registerProductWithBlockchain(
  manufacturerCode: string,
  product: {
    name: string;
    description?: string;
    nfcId: string;
  }
): Promise<{
  product: Product | null;
  blockchain?: {
    transactionHash: string;
    productAccount?: string;
    owner?: string;
  };
}> {
  try {
    // Step 1: Get manufacturer ID from code
    const manufacturerQuery = `
      SELECT id FROM users 
      WHERE manufacturer_code = $1 
      AND role = 'manufacturer';
    `;

    const manufacturerResult = await db.query(manufacturerQuery, [
      manufacturerCode,
    ]);

    if (manufacturerResult.rows.length === 0) {
      console.log("No manufacturer found with code:", manufacturerCode);
      return { product: null };
    }

    const manufacturerId = manufacturerResult.rows[0].id;

    // Step 2: Generate a unique product ID
    const productId = `PROD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Step 3: Register with blockchain if NFC ID is provided
    let blockchainResult;
    if (product.nfcId) {
      blockchainResult = await registerWithBlockchain({
        nfcId: product.nfcId,
        productId: productId,
      });

      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error);
      }
    }

    // Step 4: Register in database
    const query = `
      INSERT INTO products (
        product_id,
        name, 
        description, 
        manufacturer_id
      ) VALUES ($1, $2, $3, $4)
      RETURNING id, product_id, name, description, manufacturer_id, created_at;
    `;

    const values = [
      productId,
      product.name,
      product.description || null,
      manufacturerId,
    ];

    const result = await db.query(query, values);

    return {
      product: result.rows[0],
      ...(blockchainResult && {
        blockchain: {
          transactionHash: blockchainResult.transactionHash,
          productAccount: blockchainResult.productAccount,
          owner: blockchainResult.owner,
        },
      }),
    };
  } catch (error) {
    console.error("Product registration failed:", error);
    throw error;
  }
}
