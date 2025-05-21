"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, X, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Generate a UUID v4 token
function generateUUID() {
  // This is a simple UUID v4 implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function RecoveryCodeModal() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [recoveryToken, setRecoveryToken] = useLocalStorage<string>("cyberEssentialsToken", "")

  // Generate a token if one doesn't exist
  useEffect(() => {
    if (!recoveryToken) {
      const newToken = generateUUID()
      setRecoveryToken(newToken)
    }
  }, [recoveryToken, setRecoveryToken])

  const handleCopyToClipboard = () => {
    if (recoveryToken) {
      navigator.clipboard.writeText(recoveryToken)
      toast({
        title: "Copied to clipboard",
        description: "Your recovery code has been copied to your clipboard.",
        duration: 3000,
      })
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        Get Recovery Code
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle>Your Recovery Code</CardTitle>
          <CardDescription>
            Save this code to restore your progress on other devices or if you clear your browser data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md font-mono text-center break-all">{recoveryToken}</div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-1 flex-shrink-0" />
              This is your unique recovery code. Keep it somewhere safe. You'll need this code to restore your progress
              if you use a different device or browser.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button onClick={handleCopyToClipboard} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy to Clipboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
