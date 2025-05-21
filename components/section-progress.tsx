"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/data"

interface SectionProgressProps {
  questions: Question[]
  completedSteps: Record<string, string[]>
  excludedPlatforms: Record<string, string[]>
  onJumpToIncomplete: () => void
}

export function SectionProgress({
  questions,
  completedSteps,
  excludedPlatforms,
  onJumpToIncomplete,
}: SectionProgressProps) {
  const calculateQuestionProgress = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return 0

    // Get excluded platforms for this question
    const excludedPlatformsForQuestion = excludedPlatforms[questionId] || []

    // Filter out excluded platforms
    const applicablePlatforms = question.platforms.filter(
      (platform) => !excludedPlatformsForQuestion.includes(platform.id),
    )

    // If all platforms are excluded, return 100% (fully complete)
    if (applicablePlatforms.length === 0) return 100

    // Get steps from applicable platforms
    const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)

    // If there are no steps in applicable platforms, return 100%
    if (allSteps.length === 0) return 100

    // Get completed steps for this question
    const completedStepsForQuestion = completedSteps[questionId] || []

    // Only count completed steps that belong to applicable platforms
    const completedStepsInApplicablePlatforms = completedStepsForQuestion.filter((stepId) => {
      // Find which platform this step belongs to
      for (const platform of applicablePlatforms) {
        if (platform.steps.some((step) => step.id === stepId)) {
          return true
        }
      }
      return false
    })

    // Calculate completion percentage
    return allSteps.length > 0 ? (completedStepsInApplicablePlatforms.length / allSteps.length) * 100 : 100
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Section Progress</CardTitle>
        <CardDescription>Track your completion of this section</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="truncate" title={question.title}>
                  {question.title.length > 30 ? `${question.title.substring(0, 30)}...` : question.title}
                </span>
                <span>{Math.round(calculateQuestionProgress(question.id))}%</span>
              </div>
              <Progress value={calculateQuestionProgress(question.id)} className="h-1" />
            </div>
          ))}
        </div>

        <Button variant="ghost" className="w-full mt-6" onClick={onJumpToIncomplete}>
          Jump to next incomplete
        </Button>
      </CardContent>
    </Card>
  )
}
