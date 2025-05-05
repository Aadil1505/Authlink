// components/verification/ErrorView.tsx
import { ArrowRight, ShieldX } from 'lucide-react';

interface ErrorViewProps {
  error: string;
}

export default function ErrorView({ error }: ErrorViewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
            <ShieldX className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-2">Verification Failed</h3>
          <p className="mb-4 text-sm">
            We encountered an issue while verifying this product
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
            <span>Check if the product is registered in our blockchain system</span>
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
  );
}