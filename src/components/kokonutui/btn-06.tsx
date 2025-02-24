"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface Btn06Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string
  successDuration?: number
}

export default function Btn06({ className, textToCopy, successDuration = 2000, ...props }: Btn06Props) {
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), successDuration)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 relative group", isCopied && "text-green-500", className)}
      onClick={handleCopy}
      {...props}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}

