// components/verification/VerificationLoadingState.tsx

export default function VerificationLoadingState() {
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
          <div className="text-sm text-muted-foreground">Verifying product authenticity...</div>
        </div>
      </div>
    );
  }