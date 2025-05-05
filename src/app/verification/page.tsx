import { authCheck } from "@/lib/actions/auth";
import { verifyTag } from "@/lib/actions/verification";
import { getProductByUid } from "@/lib/actions/verify";
import VerificationView from "@/components/verification/VerificationView";
import { Suspense } from 'react';
import VerificationLoadingState from "@/components/verification/VerificationLoadingState";
import { VerificationResult } from "@/types/verification";
import ProductDetailsView from "@/components/verification/ProductDetailsView";

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const uid = searchParams.uid as string;
  const ctr = searchParams.ctr as string;
  const cmac = searchParams.cmac as string;
  // New parameter to control view
  const showProduct = searchParams.showProduct === 'true';

  const session = await authCheck();
  console.log(session.role);

  console.log("Parameters received:", uid, ctr, cmac);
  
  let verificationResult: VerificationResult | null = null;
  let error: string | null = null;
  let product = null;
  
  // Check if all required parameters are provided
  const hasAllParams = uid && ctr && cmac;
  
  // Only attempt verification if all parameters are present
  if (hasAllParams) {
    try {
      verificationResult = await verifyTag(uid, ctr, cmac);
      console.log(verificationResult);
      
      if (verificationResult.error) {
        error = verificationResult.error;
      } else if (verificationResult.success && showProduct) {
        // If verification is successful and showProduct flag is true, fetch product details
        const productId = verificationResult.blockchainData?.product?.productId;
        if (productId) {
          const productResponse = await getProductByUid(productId);
          console.log("this is a product response" ,productResponse)
          if (productResponse.product) {
            product = productResponse.product;
          } else {
            error = productResponse.error || "Failed to fetch product details";
          }
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "An unexpected error occurred during verification";
      console.error("Verification error:", err);
    }
  } else {
    error = "Missing required parameters (uid, ctr, or cmac)";
  }

  // Determine verification status - requires both verifications to pass
  const isVerified = verificationResult?.success === true;
  
  // For navigation to show product details, we need a UID
  const navigationUid = verificationResult?.blockchainData?.product?.productId;
  
  // URL for showing product details on this same page
  const productViewUrl = navigationUid 
    ? `/verification?uid=${uid}&ctr=${ctr}&cmac=${cmac}&showProduct=true`
    : '#';

  // If we have verified successfully and showProduct is true, show the product details
  if (isVerified && showProduct && product && verificationResult) {
    return <ProductDetailsView product={product} verificationResult={verificationResult} />;
  }

  // Otherwise, show the verification UI
  return (
    <Suspense fallback={<VerificationLoadingState />}>
      <VerificationView 
        verificationResult={verificationResult} 
        isVerified={isVerified} 
        error={error} 
        productViewUrl={productViewUrl} 
      />
    </Suspense>
  );
}