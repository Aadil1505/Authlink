// components/verification/SuccessView.tsx
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock } from 'lucide-react';
import { VerificationResult } from "@/types/verification";

interface SuccessViewProps {
  result: VerificationResult;
}

export default function SuccessView({ result }: SuccessViewProps) {
  // Determine which sections to show
  const showNfcSection = result.nfcVerified && result.nfcData;
  const showBlockchainSection = result.blockchainVerified && result.blockchainData?.product;
  
  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      <div className={`rounded-lg border p-6 ${
        result.success 
          ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800/30 dark:bg-green-950/50 dark:text-green-200"
          : "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800/30 dark:bg-yellow-950/50 dark:text-yellow-200"
      }`}>
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 rounded-full p-3 ${
            result.success
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
          }`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {result.success 
              ? "Product Successfully Verified" 
              : "Partial Verification"}
          </h3>
          <p className="mb-4 text-sm">
            {result.success
              ? "This product has been authenticated with both NFC security and blockchain verification"
              : "This product has been partially verified - see details below"}
          </p>
          
          {/* Verification Status Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant={result.nfcVerified ? "default" : "destructive"} className="font-normal">
              NFC: {result.nfcVerified ? "Verified" : "Failed"}
            </Badge>
            <Badge variant={result.blockchainVerified ? "default" : "destructive"} className="font-normal">
              Blockchain: {result.blockchainVerified ? "Verified" : "Failed"}
            </Badge>
          </div>
          
          {/* Error Message (if partial verification) */}
          {!result.success && result.error && (
            <div className="mt-4 w-full max-w-md rounded-md bg-yellow-100/50 p-3 text-xs">
              {result.error}
            </div>
          )}
        </div>
      </div>
      
      {/* NFC Tag Details */}
      {showNfcSection && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-muted/50 px-6 py-3 border-b text-center">
            <h4 className="font-medium">NFC Tag Details</h4>
          </div>
          <div className="p-0">
            <div className="grid divide-y">
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">UID</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className="font-mono">
                    {result.nfcData?.uid}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">Read Counter</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className="font-mono">
                    {result.nfcData?.read_ctr}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">Encryption</div>
                <div className="col-span-2 flex justify-center">
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/20 font-medium">
                    {result.nfcData?.enc_mode}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Blockchain Verification Details */}
      {showBlockchainSection && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="bg-muted/50 px-6 py-3 border-b text-center">
            <h4 className="font-medium">Blockchain Verification</h4>
          </div>
          <div className="p-0">
            <div className="grid divide-y">
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">Product ID</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className="font-mono">
                    {result.blockchainData?.product?.productId}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">Owner</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className="font-mono truncate max-w-[200px]">
                    {result.blockchainData?.product?.owner}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center p-4">
                <div className="font-medium text-sm text-center">Account</div>
                <div className="col-span-2 flex justify-center">
                  <Badge variant="outline" className="font-mono truncate max-w-[200px]">
                    {result.blockchainData?.product?.productAccount}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification timestamp */}
      <div className={`rounded-md p-4 border flex justify-center ${
        result.success
          ? "bg-green-50 border-green-100 dark:bg-green-950/30 dark:border-green-900/30"
          : "bg-yellow-50 border-yellow-100 dark:bg-yellow-950/30 dark:border-yellow-900/30"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1.5 ${
            result.success
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
              : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
          }`}>
            <Lock className="h-4 w-4" />
          </div>
          <p className={`text-xs ${
            result.success
              ? "text-green-700 dark:text-green-300"
              : "text-yellow-700 dark:text-yellow-300"
          }`}>
            {result.success
              ? "Verified with dual security (NFC + Blockchain)"
              : "Partially verified"} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}