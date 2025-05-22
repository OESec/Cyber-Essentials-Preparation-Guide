"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, X, Info, KeyRound, ArrowRight, Clock, RefreshCw, Mail, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define the recovery token type with expiration and email
interface RecoveryTokenData {
  token: string
  expiresAt: number // Unix timestamp in milliseconds
  email?: string // Associated email for verification
}

// Generate a UUID v4 token
function generateUUID() {
  // This is a simple UUID v4 implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Default expiration period - 30 days in milliseconds
const DEFAULT_EXPIRATION_PERIOD = 30 * 24 * 60 * 60 * 1000

// Verification code expiration - 10 minutes in milliseconds
const VERIFICATION_CODE_EXPIRATION = 10 * 60 * 1000

export function RecoveryCodeModal() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [recoveryTokenData, setRecoveryTokenData] = useLocalStorage<RecoveryTokenData | null>(
    "cyberEssentialsTokenData",
    null,
  )
  const [inputToken, setInputToken] = useState("")
  const [inputEmail, setInputEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [inputVerificationCode, setInputVerificationCode] = useState("")
  const [verificationCodeExpiry, setVerificationCodeExpiry] = useState<number | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [activeTab, setActiveTab] = useState("view")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [expirationPercentage, setExpirationPercentage] = useState(100)
  const [recoveryStep, setRecoveryStep] = useState<"code" | "success">("code")
  const [emailVerified, setEmailVerified] = useState(false)
  const [userEmail, setUserEmail] = useLocalStorage<string | null>("cyberEssentialsUserEmail", null)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Check if this is a fresh user (no progress data)
  const [isFreshUser, setIsFreshUser] = useState(true)

  // Generate a token if one doesn't exist or refresh the expiration timer
  useEffect(() => {
    if (!initialLoadComplete) {
      if (!recoveryTokenData) {
        generateNewTokenSilently()
      } else {
        // Calculate time remaining
        updateTimeRemaining()

        // If we have an email stored with the token, use it
        if (recoveryTokenData.email && !userEmail) {
          setUserEmail(recoveryTokenData.email)
        }
      }

      // Check if user has any existing progress
      const progressData = localStorage.getItem("cyberEssentialsProgress")
      const completedStepsData = localStorage.getItem("cyberEssentialsSteps")
      const hasProgress = progressData && Object.keys(JSON.parse(progressData)).length > 0
      const hasCompletedSteps = completedStepsData && Object.keys(JSON.parse(completedStepsData)).length > 0

      setIsFreshUser(!hasProgress && !hasCompletedSteps)
      setInitialLoadComplete(true)
    }

    // If fresh user and modal is opened, default to the restore tab
    if (isFreshUser && isOpen) {
      setActiveTab("restore")
    }

    // Set up interval to update time remaining
    const interval = setInterval(updateTimeRemaining, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [recoveryTokenData, isOpen, isFreshUser, userEmail, initialLoadComplete])

  // Function to generate a new token with expiration (silently, without toast)
  const generateNewTokenSilently = () => {
    const newToken = generateUUID()
    const expiresAt = Date.now() + DEFAULT_EXPIRATION_PERIOD

    setRecoveryTokenData({
      token: newToken,
      expiresAt: expiresAt,
      email: userEmail || undefined,
    })

    updateTimeRemaining()
  }

  // Function to generate a new token with expiration (with toast notification)
  const generateNewToken = () => {
    const newToken = generateUUID()
    const expiresAt = Date.now() + DEFAULT_EXPIRATION_PERIOD

    setRecoveryTokenData({
      token: newToken,
      expiresAt: expiresAt,
      email: userEmail || undefined,
    })

    updateTimeRemaining()

    toast({
      title: "New Recovery Code Generated",
      description: "Your recovery code will expire in 30 days. Make sure to save it.",
      duration: 3000,
    })
  }

  // Function to update time remaining calculation
  const updateTimeRemaining = () => {
    if (!recoveryTokenData) return

    const now = Date.now()
    const remaining = Math.max(0, recoveryTokenData.expiresAt - now)
    setTimeRemaining(remaining)

    // Calculate percentage of time remaining
    const totalDuration = DEFAULT_EXPIRATION_PERIOD
    const percentage = Math.max(0, Math.min(100, (remaining / totalDuration) * 100))
    setExpirationPercentage(percentage)
  }

  // Format the time remaining in a human-readable format
  const formatTimeRemaining = () => {
    if (timeRemaining === null || timeRemaining <= 0) return "Expired"

    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""}`
    } else {
      const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
      return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
  }

  // Get expiration status and styling
  const getExpirationStatus = () => {
    if (!timeRemaining) return { status: "expired", color: "destructive" }

    if (timeRemaining < 24 * 60 * 60 * 1000) {
      // Less than 1 day
      return { status: "expiring soon", color: "destructive" }
    } else if (timeRemaining < 7 * 24 * 60 * 60 * 1000) {
      // Less than 7 days
      return { status: "expires soon", color: "warning" }
    } else {
      return { status: "valid", color: "success" }
    }
  }

  const expirationStatus = getExpirationStatus()

  const handleCopyToClipboard = () => {
    if (recoveryTokenData?.token) {
      navigator.clipboard.writeText(recoveryTokenData.token)
      toast({
        title: "Copied to clipboard",
        description: "Your recovery code has been copied to your clipboard.",
        duration: 3000,
      })
    }
  }

  // Function to validate the recovery code format
  const validateRecoveryCode = () => {
    // Simple validation - check if it's a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(inputToken)) {
      setValidationError("Invalid recovery code format. Please check and try again.")
      return false
    }
    return true
  }

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Function to handle the first step of recovery - validating the recovery code
  const handleValidateRecoveryCode = () => {
    setIsValidating(true)
    setValidationError("")

    if (!validateRecoveryCode()) {
      setIsValidating(false)
      return
    }

    // Simulate a short delay for validation
    setTimeout(() => {
      setIsValidating(false)

      // Skip email verification and go directly to success
      setRecoveryStep("success")

      // Create a new token with the current settings
      const expiresAt = Date.now() + DEFAULT_EXPIRATION_PERIOD
      setRecoveryTokenData({
        token: inputToken,
        expiresAt: expiresAt,
        email: userEmail || undefined,
      })

      toast({
        title: "Recovery Successful",
        description: "Your progress has been restored successfully.",
        duration: 3000,
      })
    }, 1000)
  }

  // Function to send verification code to email
  const handleSendVerificationCode = () => {
    if (!validateEmail(inputEmail)) {
      setValidationError("Please enter a valid email address.")
      return
    }

    setIsSendingCode(true)
    setValidationError("")

    // Generate a verification code
    const code = generateVerificationCode()
    setVerificationCode(code)
    setVerificationCodeExpiry(Date.now() + VERIFICATION_CODE_EXPIRATION)

    // Simulate sending an email
    setTimeout(() => {
      setIsSendingCode(false)
      setRecoveryStep("verify")

      // In a real application, this would send an actual email
      // For demo purposes, we'll show the code in a toast
      toast({
        title: "Verification Code Sent",
        description: `Your verification code is: ${code}`,
        duration: 10000,
      })
    }, 1500)
  }

  // Function to verify the code
  const handleVerifyCode = () => {
    setIsValidating(true)
    setValidationError("")

    // Check if code has expired
    if (verificationCodeExpiry && Date.now() > verificationCodeExpiry) {
      setValidationError("Verification code has expired. Please request a new code.")
      setIsValidating(false)
      return
    }

    // Check if code matches
    if (inputVerificationCode !== verificationCode) {
      setValidationError("Invalid verification code. Please try again.")
      setIsValidating(false)
      return
    }

    // Simulate verification delay
    setTimeout(() => {
      setIsValidating(false)
      setEmailVerified(true)
      setUserEmail(inputEmail)

      // Create a new token with the verified email
      const expiresAt = Date.now() + DEFAULT_EXPIRATION_PERIOD
      setRecoveryTokenData({
        token: inputToken,
        expiresAt: expiresAt,
        email: inputEmail,
      })

      setRecoveryStep("success")

      toast({
        title: "Email Verified",
        description: "Your email has been verified and your progress has been restored.",
        duration: 3000,
      })
    }, 1000)
  }

  // Function to complete the recovery process
  const handleCompleteRecovery = () => {
    setIsOpen(false)

    // In a real implementation, we would reload the page or update the UI
    // to reflect the restored progress
    window.location.reload()
  }

  // Function to save email during token generation
  const handleSaveEmail = () => {
    if (!userEmail && recoveryTokenData) {
      if (!validateEmail(inputEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      setUserEmail(inputEmail)

      // Update the token data with the email
      setRecoveryTokenData({
        ...recoveryTokenData,
        email: inputEmail,
      })

      toast({
        title: "Email Saved",
        description: "Your email has been associated with your recovery code.",
        duration: 3000,
      })
    }
  }

  // Button to open the modal - show different text for fresh users
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true)
          setActiveTab(isFreshUser ? "restore" : "view")
          // Reset recovery flow state
          setRecoveryStep("code")
          setInputToken("")
          setInputEmail("")
          setInputVerificationCode("")
          setEmailVerified(false)
          setValidationError("")
        }}
        className="flex items-center gap-2"
      >
        {isFreshUser ? (
          <>
            <KeyRound className="h-4 w-4" />
            Restore Progress
          </>
        ) : (
          <>
            <Info className="h-4 w-4" />
            Get Recovery Code
          </>
        )}
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
          <CardTitle>Recovery Code</CardTitle>
          <CardDescription>Use your recovery code to restore progress or save it for future use.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View Code</TabsTrigger>
              <TabsTrigger value="restore">Restore Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="mt-4">
              {recoveryTokenData && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Expires in: {formatTimeRemaining()}</span>
                    </div>
                    <Badge
                      variant={
                        expirationStatus.color as
                          | "default"
                          | "destructive"
                          | "outline"
                          | "secondary"
                          | "success"
                          | "warning"
                      }
                    >
                      {expirationStatus.status}
                    </Badge>
                  </div>

                  <Progress value={expirationPercentage} className="h-1 mb-4" />

                  <div className="bg-muted p-4 rounded-md font-mono text-center break-all">
                    {recoveryTokenData.token}
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <Info className="h-4 w-4 mt-1 flex-shrink-0" />
                      This is your unique recovery code. Keep it somewhere safe. You'll need this code to restore your
                      progress if you use a different device or browser. This code will expire in{" "}
                      {formatTimeRemaining()}.
                    </p>
                  </div>

                  {/* Email association section */}
                  <div className="mt-4 p-3 border rounded-md">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" /> Email Association
                    </h4>

                    {userEmail ? (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Recovery code is associated with: <strong>{userEmail}</strong>
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Associate an email with your recovery code for additional security.
                        </p>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                            size={30}
                          />
                          <Button size="sm" onClick={handleSaveEmail}>
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button onClick={handleCopyToClipboard} className="flex items-center justify-center gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={generateNewToken}
                      className="flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Generate New Code
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="restore" className="mt-4">
              <div className="space-y-4">
                {recoveryStep === "code" && (
                  <>
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <KeyRound className="h-4 w-4 mt-1 flex-shrink-0" />
                        Enter your recovery code to restore your progress from another device or browser.
                      </p>
                    </div>

                    <Input
                      placeholder="Enter your recovery code"
                      value={inputToken}
                      onChange={(e) => {
                        setInputToken(e.target.value)
                        setValidationError("")
                      }}
                      className="font-mono"
                    />

                    {validationError && <div className="text-sm text-destructive">{validationError}</div>}

                    <Button
                      onClick={handleValidateRecoveryCode}
                      disabled={!inputToken || isValidating}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {isValidating ? (
                        "Validating..."
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </>
                )}

                {recoveryStep === "success" && (
                  <>
                    <div className="text-center py-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Recovery Successful!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your progress has been successfully restored.
                      </p>
                      <Button onClick={handleCompleteRecovery} className="w-full">
                        Continue to Dashboard
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
