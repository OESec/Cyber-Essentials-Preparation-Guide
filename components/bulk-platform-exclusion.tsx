"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertCircle, Check, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Question } from "@/lib/data"

interface BulkPlatformExclusionProps {
  questions: Question[]
  excludedPlatforms: Record<string, string[]>
  onBulkExclude: (platformId: string, excluded: boolean) => void
  onClose: () => void
}

export function BulkPlatformExclusion({
  questions,
  excludedPlatforms,
  onBulkExclude,
  onClose,
}: BulkPlatformExclusionProps) {
  // Get unique platforms across all questions
  const [uniquePlatforms, setUniquePlatforms] = useState<{ id: string; name: string }[]>([])
  const [platformStatus, setPlatformStatus] = useState<Record<string, boolean>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Extract all unique platforms from questions
    const platforms = new Map<string, string>()

    questions.forEach((question) => {
      question.platforms.forEach((platform) => {
        platforms.set(platform.id, platform.name)
      })
    })

    const uniquePlatformsList = Array.from(platforms.entries()).map(([id, name]) => ({ id, name }))
    setUniquePlatforms(uniquePlatformsList)

    // Initialize platform status based on current exclusions
    const initialStatus: Record<string, boolean> = {}
    uniquePlatformsList.forEach(({ id }) => {
      // A platform is considered included if it's not excluded in ANY question
      const isIncludedInAllQuestions = questions.every((question) => {
        const questionExcluded = excludedPlatforms[question.id] || []
        return !questionExcluded.includes(id)
      })

      initialStatus[id] = isIncludedInAllQuestions
    })

    setPlatformStatus(initialStatus)
  }, [questions, excludedPlatforms])

  const handleTogglePlatform = (platformId: string) => {
    setPlatformStatus((prev) => {
      const newStatus = { ...prev, [platformId]: !prev[platformId] }
      setHasChanges(true)
      return newStatus
    })
  }

  const handleApply = () => {
    // Apply changes for each platform
    Object.entries(platformStatus).forEach(([platformId, isIncluded]) => {
      onBulkExclude(platformId, !isIncluded)
    })
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Bulk Platform Management</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Select which platforms are applicable to your organization. Excluded platforms will not be scored.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Changes will apply to all questions in this section. Platforms marked as "Not Applicable" will be excluded
            from scoring calculations.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {uniquePlatforms.map((platform) => (
            <div
              key={platform.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Checkbox
                id={`platform-${platform.id}`}
                checked={platformStatus[platform.id]}
                onCheckedChange={() => handleTogglePlatform(platform.id)}
              />
              <Label htmlFor={`platform-${platform.id}`} className="flex-grow cursor-pointer">
                {platform.name}
              </Label>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  platformStatus[platform.id]
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {platformStatus[platform.id] ? "Applicable" : "Not Applicable"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleApply} disabled={!hasChanges}>
          <Check className="mr-2 h-4 w-4" /> Apply to All Questions
        </Button>
      </CardFooter>
    </Card>
  )
}
