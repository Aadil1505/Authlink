// page.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { verifyTag } from '@/lib/actions/verify';
import { ArrowRight, Check, Lock, ShieldCheck, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

type SuccessResponse = {
  uid: string;
  read_ctr: number;
  enc_mode: string;
}

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const uid = searchParams.uid as string
  const ctr = searchParams.ctr as string
  const cmac = searchParams.cmac as string

  console.log("Parameters received:", uid, ctr, cmac)
  
  let verificationResult: SuccessResponse | null = null;
  let error: string | null = null;
  
  // Check if all required parameters are provided
  const hasAllParams = uid && ctr && cmac;
  
  // Only attempt verification if all parameters are present
  if (hasAllParams) {
    const verification = await verifyTag(uid, ctr, cmac);
    
    if ('error' in verification) {
      error = verification.error;
    } else if (verification.result) {
      verificationResult = verification.result;
    }
  } else {
    error = "Missing required parameters (uid, ctr, or cmac)";
  }

  // Determine verification status
  const isVerified = verificationResult !== null;

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
                Confirm the authenticity and security of your NFC tag with our advanced verification system
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
                    ? "Tag successfully verified with our secure system" 
                    : "We've encountered an issue with this tag"}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 pt-8 flex justify-center">
              <div className="w-full max-w-lg">
                {isVerified ? (
                  <Suspense fallback={<VerificationLoadingState />}>
                    <SuccessView result={verificationResult!} />
                  </Suspense>
                ) : (
                  <ErrorView error={error || "Verification failed"} />
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t bg-muted/20 p-6 flex justify-center">
              <div className="flex flex-col items-center w-full max-w-md space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  Every verified tag includes cryptographic signatures to ensure authenticity
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  {isVerified ? (
                    <Button variant="outline">
                      <Link href={`verification/${uid}`} className='flex items-center justify-center'>                    
                        <Check className="mr-2 h-3.5 w-3.5" />
                        Continue
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
            <h2 className="text-xl font-semibold mb-4 text-center">About NFC Tag Verification</h2>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="tech">Technology</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Our NFC tag verification system enables you to confirm the authenticity of products, 
                  documents, or access credentials with a simple scan. Each tag contains unique cryptographic 
                  signatures that can't be replicated, providing you with confidence in the verification result.
                </p>
              </TabsContent>
              <TabsContent value="security" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Authlink uses advanced encryption standards (AES) and specialized NFC security features 
                  to protect against counterfeiting. Each verification includes a unique counter value that 
                  increases with each scan, allowing you to detect unauthorized duplication attempts.
                </p>
              </TabsContent>
              <TabsContent value="tech" className="p-4 text-center">
                <p className="text-sm text-muted-foreground mx-auto max-w-xl">
                  Our system leverages Secure Dynamic Messaging (SDM) technology with cryptographic 
                  message authentication codes (CMAC) to verify tag authenticity. This provides 
                  enterprise-grade security while maintaining ease of use for consumers.
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
  )
}

function ErrorView({ error }: { error: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
            <ShieldX className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-2">Verification Failed</h3>
          <p className="mb-4 text-sm">
            We encountered an issue while verifying your NFC tag
          </p>
          
          <div className="w-full max-w-md rounded-md bg-destructive/5 p-4 font-mono text-xs text-center">
            {error}
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-muted p-5 max-w-md mx-auto">
        <h3 className="font-medium text-center mb-3">Troubleshooting Steps</h3>
        <ul className="space-y-2 text-sm text-muted-foreground max-w-sm mx-auto">
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
              <ArrowRight className="h-3 w-3" />
            </div>
            <span>Ensure your NFC tag is properly positioned over the scanner</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
              <ArrowRight className="h-3 w-3" />
            </div>
            <span>Wait a few seconds and try scanning again</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
              <ArrowRight className="h-3 w-3" />
            </div>
            <span>Check if the tag is damaged or has been tampered with</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="rounded-full bg-muted-foreground/20 p-1 mt-0.5">
              <ArrowRight className="h-3 w-3" />
            </div>
            <span>If problems persist, contact our support team for assistance</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function SuccessView({ result }: { result: SuccessResponse }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800 dark:border-green-800/30 dark:bg-green-950/50 dark:text-green-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-2">Tag Successfully Verified</h3>
          <p className="mb-4 text-sm">
            This NFC tag has been authenticated with our secure verification system
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="bg-muted/50 px-6 py-3 border-b text-center">
          <h4 className="font-medium">Tag Details</h4>
        </div>
        <div className="p-0">
          <div className="grid divide-y">
            <div className="grid grid-cols-3 items-center p-4">
              <div className="font-medium text-sm text-center">UID</div>
              <div className="col-span-2 flex justify-center">
                <Badge variant="outline" className="font-mono">
                  {result.uid}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center p-4">
              <div className="font-medium text-sm text-center">Read Counter</div>
              <div className="col-span-2 flex justify-center">
                <Badge variant="outline" className="font-mono">
                  {result.read_ctr}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center p-4">
              <div className="font-medium text-sm text-center">Encryption</div>
              <div className="col-span-2 flex justify-center">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/20 font-medium">
                  {result.enc_mode}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-md bg-green-50 p-4 border border-green-100 dark:bg-green-950/30 dark:border-green-900/30 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-100 p-1.5 text-green-600 dark:bg-green-900 dark:text-green-300">
            <Lock className="h-4 w-4" />
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">
            Verified with secure cryptographic signature at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}

function VerificationLoadingState() {
  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary/20"></div>
        <div className="space-y-2 flex flex-col items-center">
          <div className="h-5 w-32 animate-pulse rounded-md bg-muted"></div>
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted"></div>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-border"></div>
      
      <div className="space-y-4 w-full max-w-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-muted"></div>
          <div className="h-8 w-40 animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="h-4 w-28 animate-pulse rounded-md bg-muted"></div>
          <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted"></div>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="text-sm text-muted-foreground">Verifying tag authenticity...</div>
      </div>
    </div>
  )
}