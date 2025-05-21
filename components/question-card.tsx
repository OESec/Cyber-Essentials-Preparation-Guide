import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"
import type { Question } from "@/lib/data"
import { PlatformSteps } from "@/components/platform-steps"

interface QuestionCardProps {
  question: Question
  completedSteps: string[]
  excludedPlatforms: string[]
  onToggleStep: (stepId: string) => void
  onTogglePlatform: (questionId: string, platformId: string, excluded: boolean) => void
}

export function QuestionCard({
  question,
  completedSteps,
  excludedPlatforms,
  onToggleStep,
  onTogglePlatform,
}: QuestionCardProps) {
  const calculateProgress = () => {
    // Get all steps from non-excluded platforms
    const applicablePlatforms = question.platforms.filter((platform) => !excludedPlatforms.includes(platform.id))

    // If all platforms are excluded, return 100% (fully complete)
    if (applicablePlatforms.length === 0) return 100

    const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)

    // If there are no steps in applicable platforms, return 100%
    if (allSteps.length === 0) return 100

    // Calculate completion percentage based on completed steps
    return (completedSteps.length / allSteps.length) * 100
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{question.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{question.description}</p>
          </div>
          <div className="flex items-center">
            <Progress value={calculateProgress()} className="w-24 h-2 mr-2" />
            <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.note && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md mb-4 flex">
            <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">{question.note}</div>
          </div>
        )}

        <Tabs defaultValue={question.platforms[0].id} className="mt-4">
          <TabsList className="mb-4">
            {question.platforms.map((platform) => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className={excludedPlatforms.includes(platform.id) ? "opacity-70" : ""}
              >
                {platform.name}
                {excludedPlatforms.includes(platform.id) && " (N/A)"}
              </TabsTrigger>
            ))}
          </TabsList>

          {question.platforms.map((platform) => (
            <TabsContent key={platform.id} value={platform.id}>
              <PlatformSteps
                platform={platform}
                completedSteps={completedSteps}
                excludedPlatforms={excludedPlatforms}
                onToggleStep={onToggleStep}
                onTogglePlatform={(platformId, excluded) => onTogglePlatform(question.id, platformId, excluded)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
