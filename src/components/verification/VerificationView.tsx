// components/verification/VerificationView.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuccessView from "./SuccessView";
import ErrorView from "./ErrorView";
import { ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import VerificationLoadingState from "./VerificationLoadingState";
import { VerificationResult } from "@/types/verification";

interface VerificationViewProps {
  verificationResult: VerificationResult | null;
  isVerified: boolean;
  error: string | null;
  productViewUrl: string;
}

export default function VerificationView({ 
  verificationResult, 
  isVerified, 
  error, 
  productViewUrl 
}: VerificationViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 md:py-16 md:px-6">
        <div className="w-full max-w-3xl space-y-10">
          <div className="flex flex-col items-center space-y-5 text-center">
            <div className="inline-block rounded-full bg-primary/10 p-4">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Authlink Verification</h1>
              <p className="mt-3 mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                Confirm the authenticity and security of your NFC tag with our advanced dual verification system
              </p>
            </div>
          </div>

          <Card className="w-full border shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-8 pt-6 flex flex-col items-center">
              <div className="flex flex-col items-center text-center">
                <Badge variant={isVerified ? "default" : "destructive"} className="mb-2">
                  {isVerified ? "Verified" : "Failed"}
                </Badge>
                <CardTitle className="text-xl md:text-2xl">Verification Status</CardTitle>
                <CardDescription className="mt-1.5 text-center">
                  {isVerified 
                    ? "Product successfully verified with our dual security system" 
                    : "We've encountered an issue with this verification"}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 pt-8 flex justify-center">
              <div className="w-full max-w-lg">
                {verificationResult ? (
                  <Suspense fallback={<VerificationLoadingState />}>
                    <SuccessView result={verificationResult} />
                  </Suspense>
                ) : (
                  <ErrorView error={error || "Verification failed"} />
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-muted/20 p-6 flex justify-center">
              <div className="flex flex-col items-center w-full max-w-md space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Every verified product is authenticated with both NFC security and blockchain verification
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  {isVerified ? (
                    <Button variant="outline">
                      <Link href={productViewUrl} className='flex items-center justify-center'>                    
                        <Check className="mr-2 h-3.5 w-3.5" />
                        View Product Details
                      </Link>
                    </Button>
                  ) : (
                    <Badge variant="destructive">
                      Try Again
                    </Badge>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">About Our Dual Verification System</h2>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Our dual verification system enables you to confirm product authenticity using both secure NFC 
                  technology and blockchain verification. This two-layer approach provides unmatched protection 
                  against counterfeiting and tampering.
                </p>
              </TabsContent>
              <TabsContent value="security" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Authlink uses advanced encryption standards (AES) in our NFC tags, plus Solana blockchain 
                  verification that creates an immutable record of each product. This dual approach ensures 
                  that product authenticity can be verified even if one security system is compromised.
                </p>
              </TabsContent>
              <TabsContent value="tech" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Our system leverages Secure Dynamic Messaging (SDM) with cryptographic message authentication codes (CMAC) 
                  for NFC security, combined with Solana blockchain verification using Program Derived Addresses (PDAs) 
                  that permanently link each product to its unique NFC identifier.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Authlink Verification System. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}