"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Settings } from "lucide-react"
import { sections, getQuestionsBySection } from "@/lib/data"
import { QuestionCard } from "@/components/question-card"
import { SectionProgress } from "@/components/section-progress"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { InsuranceDetails } from "@/components/insurance-details"
import { BulkPlatformExclusion } from "@/components/bulk-platform-exclusion"

export default function SectionPage({ params }: { params: { sectionId: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { sectionId } = params

  const section = sections.find((s) => s.id === sectionId)
  const questions = getQuestionsBySection(sectionId)

  const [completedSteps, setCompletedSteps] = useLocalStorage<Record<string, string[]>>("cyberEssentialsSteps", {})
  const [excludedPlatforms, setExcludedPlatforms] = useLocalStorage<Record<string, string[]>>(
    "cyberEssentialsExcluded",
    {},
  )
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
  const [showBulkExclusion, setShowBulkExclusion] = useState(false)

  useEffect(() => {
    // Set first question as expanded by default if none are expanded
    if (questions.length > 0 && expandedQuestions.length === 0) {
      setExpandedQuestions([questions[0].id])
    }
  }, [questions, expandedQuestions.length])

  const toggleStep = (questionId: string, stepId: string) => {
    setCompletedSteps((prev) => {
      const newCompletedSteps = { ...prev }

      if (!newCompletedSteps[questionId]) {
        newCompletedSteps[questionId] = []
      }

      if (newCompletedSteps[questionId].includes(stepId)) {
        newCompletedSteps[questionId] = newCompletedSteps[questionId].filter((id) => id !== stepId)
      } else {
        newCompletedSteps[questionId] = [...newCompletedSteps[questionId], stepId]
      }

      // Update section progress in localStorage
      updateSectionProgress(newCompletedSteps, excludedPlatforms)

      return newCompletedSteps
    })
  }

  const togglePlatform = (questionId: string, platformId: string, excluded: boolean) => {
    setExcludedPlatforms((prev) => {
      const newExcludedPlatforms = { ...prev }

      if (!newExcludedPlatforms[questionId]) {
        newExcludedPlatforms[questionId] = []
      }

      if (excluded && !newExcludedPlatforms[questionId].includes(platformId)) {
        // Add platform to excluded list
        newExcludedPlatforms[questionId] = [...newExcludedPlatforms[questionId], platformId]
      } else if (!excluded && newExcludedPlatforms[questionId].includes(platformId)) {
        // Remove platform from excluded list
        newExcludedPlatforms[questionId] = newExcludedPlatforms[questionId].filter((id) => id !== platformId)
      }

      // Update section progress with new excluded platforms
      updateSectionProgress(completedSteps, newExcludedPlatforms)

      return newExcludedPlatforms
    })
  }

  const handleBulkExclude = (platformId: string, excluded: boolean) => {
    setExcludedPlatforms((prev) => {
      const newExcludedPlatforms = { ...prev }

      // Apply the exclusion status to all questions that have this platform
      questions.forEach((question) => {
        // Check if this question has the platform
        const hasPlatform = question.platforms.some((platform) => platform.id === platformId)

        if (hasPlatform) {
          if (!newExcludedPlatforms[question.id]) {
            newExcludedPlatforms[question.id] = []
          }

          if (excluded && !newExcludedPlatforms[question.id].includes(platformId)) {
            // Add platform to excluded list
            newExcludedPlatforms[question.id] = [...newExcludedPlatforms[question.id], platformId]
          } else if (!excluded && newExcludedPlatforms[question.id].includes(platformId)) {
            // Remove platform from excluded list
            newExcludedPlatforms[question.id] = newExcludedPlatforms[question.id].filter((id) => id !== platformId)
          }
        }
      })

      // Update section progress with new excluded platforms
      updateSectionProgress(completedSteps, newExcludedPlatforms)

      return newExcludedPlatforms
    })

    toast({
      title: "Platform settings updated",
      description: `Platform settings have been applied to all applicable questions.`,
    })
  }

  const updateSectionProgress = (
    newCompletedSteps: Record<string, string[]>,
    newExcludedPlatforms: Record<string, string[]>,
  ) => {
    // Calculate total steps for this section, excluding steps from excluded platforms
    let totalSteps = 0
    let completedStepsCount = 0

    questions.forEach((question) => {
      // Get excluded platforms for this question
      const excludedPlatformsForQuestion = newExcludedPlatforms[question.id] || []

      // Filter out excluded platforms
      const applicablePlatforms = question.platforms.filter(
        (platform) => !excludedPlatformsForQuestion.includes(platform.id),
      )

      // Get steps from applicable platforms
      const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)
      totalSteps += allSteps.length

      // Count completed steps
      if (newCompletedSteps[question.id]) {
        // Only count completed steps that belong to applicable platforms
        const completedStepsInApplicablePlatforms = newCompletedSteps[question.id].filter((stepId) => {
          // Find which platform this step belongs to
          for (const platform of applicablePlatforms) {
            if (platform.steps.some((step) => step.id === stepId)) {
              return true
            }
          }
          return false
        })

        completedStepsCount += completedStepsInApplicablePlatforms.length
      }
    })

    const progressPercentage = totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 100

    // Update progress in localStorage
    const savedProgress = localStorage.getItem("cyberEssentialsProgress")
    const progress = savedProgress ? JSON.parse(savedProgress) : {}
    progress[sectionId] = progressPercentage
    localStorage.setItem("cyberEssentialsProgress", JSON.stringify(progress))
  }

  const jumpToIncomplete = () => {
    const firstIncompleteQuestion = questions.find((q) => {
      // Get excluded platforms for this question
      const excludedPlatformsForQuestion = excludedPlatforms[q.id] || []

      // Filter out excluded platforms
      const applicablePlatforms = q.platforms.filter((platform) => !excludedPlatformsForQuestion.includes(platform.id))

      // Get steps from applicable platforms
      const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)

      // Get completed steps for this question
      const completedStepsForQuestion = completedSteps[q.id] || []

      // Check if all steps are completed
      return completedStepsForQuestion.length < allSteps.length
    })

    if (firstIncompleteQuestion) {
      const element = document.getElementById(firstIncompleteQuestion.id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const navigateToNextSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId)
    if (currentIndex < sections.length - 1) {
      router.push(`/section/${sections[currentIndex + 1].id}`)
    } else {
      router.push("/dashboard")
      toast({
        title: "Congratulations!",
        description: "You've completed all sections of the Cyber Essentials preparation guide.",
      })
    }
  }

  const navigateToPreviousSection = () => {
    const currentIndex = sections.findIndex((s) => s.id === sectionId)
    if (currentIndex > 0) {
      router.push(`/section/${sections[currentIndex - 1].id}`)
    } else {
      router.push("/dashboard")
    }
  }

  if (!section) {
    return <div className="container mx-auto px-4 py-8">Section not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{section.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBulkExclusion(true)}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" /> Manage Platforms
        </Button>
      </div>

      {/* Bulk Platform Exclusion Modal */}
      {showBulkExclusion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <BulkPlatformExclusion
            questions={questions}
            excludedPlatforms={excludedPlatforms}
            onBulkExclude={handleBulkExclude}
            onClose={() => setShowBulkExclusion(false)}
          />
        </div>
      )}

      {/* Show insurance details component only for the insurance section */}
      {sectionId === "insurance" && <InsuranceDetails />}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {questions.map((question) => (
            <div key={question.id} id={question.id}>
              <QuestionCard
                question={question}
                completedSteps={completedSteps[question.id] || []}
                excludedPlatforms={excludedPlatforms[question.id] || []}
                onToggleStep={(stepId) => toggleStep(question.id, stepId)}
                onTogglePlatform={togglePlatform}
              />
            </div>
          ))}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={navigateToPreviousSection}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous Section
            </Button>
            <Button onClick={navigateToNextSection}>
              Next Section <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <SectionProgress
            questions={questions}
            completedSteps={completedSteps}
            excludedPlatforms={excludedPlatforms}
            onJumpToIncomplete={jumpToIncomplete}
          />
        </div>
      </div>
    </div>
  )
}
