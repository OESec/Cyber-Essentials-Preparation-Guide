"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ArrowRight, Clock, FileText, Lock, Settings, Shield, Smartphone, User, Upload } from 'lucide-react'
import { sections, getQuestionsBySection } from "@/lib/data"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ProgressWithMilestones } from "@/components/progress-with-milestones"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
// Add the import for the RecoveryCodeModal component
import { RecoveryCodeModal } from "@/components/recovery-code-modal"

// Add these imports for the new features
import { OrganizationProfileSetup } from "@/components/organization-profile-setup"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { MilestoneCelebration } from "@/components/milestone-celebration"
import { isPersonalizationSetup, initializePersonalization } from "@/lib/ai-personalization"

export default function Dashboard() {
  const { toast } = useToast()
  const [progress, setProgress] = useLocalStorage<Record<string, number>>("cyberEssentialsProgress", {})
  const [lastMilestoneReached, setLastMilestoneReached] = useLocalStorage<number>("lastMilestoneReached", 0)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)

  // Add these state variables for personalization
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [isPersonalized, setIsPersonalized] = useState(false)

  useEffect(() => {
    // Initialize progress for each section if not already set
    const initialProgress: Record<string, number> = { ...progress }
    let updated = false

    // Calculate actual progress for each section
    sections.forEach((section) => {
      // Force recalculation of progress values
      const questions = getQuestionsBySection(section.id)

      // Get excluded platforms data
      const excludedPlatformsData = localStorage.getItem("cyberEssentialsExcluded")
      const excludedPlatforms = excludedPlatformsData ? JSON.parse(excludedPlatformsData) : {}

      // Get completed steps data
      const completedStepsData = localStorage.getItem("cyberEssentialsSteps")
      const completedSteps = completedStepsData ? JSON.parse(completedStepsData) : {}

      let sectionTotalSteps = 0
      let sectionCompletedSteps = 0

      questions.forEach((question) => {
        // Get excluded platforms for this question
        const excludedPlatformsForQuestion = excludedPlatforms[question.id] || []

        // Filter out excluded platforms
        const applicablePlatforms = question.platforms.filter(
          (platform) => !excludedPlatformsForQuestion.includes(platform.id),
        )

        // Get steps from applicable platforms
        const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)
        sectionTotalSteps += allSteps.length

        // Count completed steps for this question
        const completedStepsForQuestion = completedSteps[question.id] || []

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

        sectionCompletedSteps += completedStepsInApplicablePlatforms.length
      })

      // Calculate section progress percentage
      const sectionProgress = sectionTotalSteps > 0 ? (sectionCompletedSteps / sectionTotalSteps) * 100 : 0

      // Update progress if it's different
      if (initialProgress[section.id] !== sectionProgress) {
        initialProgress[section.id] = sectionProgress
        updated = true
      }
    })

    if (updated) {
      setProgress(initialProgress)
    }
  }, [progress, setProgress])

  // Add this useEffect for personalization setup
  useEffect(() => {
    // Initialize personalization
    initializePersonalization()

    // Check if personalization is set up
    const personalizationReady = isPersonalizationSetup()
    setIsPersonalized(personalizationReady)

    // Show profile setup if not already personalized
    if (!personalizationReady) {
      setShowProfileSetup(true)
    }
  }, [])

  const calculateOverallProgress = () => {
    if (Object.keys(progress).length === 0) return 0

    // Get all questions for all sections
    let totalStepsCount = 0
    let completedStepsCount = 0

    // Load excluded platforms data
    const excludedPlatformsData = localStorage.getItem("cyberEssentialsExcluded")
    const excludedPlatforms = excludedPlatformsData ? JSON.parse(excludedPlatformsData) : {}

    // Load completed steps data
    const completedStepsData = localStorage.getItem("cyberEssentialsSteps")
    const completedSteps = completedStepsData ? JSON.parse(completedStepsData) : {}

    // Process each section
    sections.forEach((section) => {
      const questions = getQuestionsBySection(section.id)

      questions.forEach((question) => {
        // Get excluded platforms for this question
        const excludedPlatformsForQuestion = excludedPlatforms[question.id] || []

        // Filter out excluded platforms
        const applicablePlatforms = question.platforms.filter(
          (platform) => !excludedPlatformsForQuestion.includes(platform.id),
        )

        // Get steps from applicable platforms
        const allSteps = applicablePlatforms.flatMap((platform) => platform.steps)
        totalStepsCount += allSteps.length

        // Count completed steps for this question
        const completedStepsForQuestion = completedSteps[question.id] || []

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

        completedStepsCount += completedStepsInApplicablePlatforms.length
      })
    })

    // Calculate overall progress percentage
    return totalStepsCount > 0 ? (completedStepsCount / totalStepsCount) * 100 : 0
  }

  const overallProgress = calculateOverallProgress()

  // Enhanced milestone achievement check with celebration
  useEffect(() => {
    const currentProgress = calculateOverallProgress()
    const milestones = [0, 25, 50, 75, 100]

    // Find the highest milestone reached
    const highestMilestoneReached = milestones.reduce((highest, milestone) => {
      return currentProgress >= milestone ? milestone : highest
    }, 0)

    // If we've reached a new milestone, show a toast and trigger celebration
    if (highestMilestoneReached > lastMilestoneReached) {
      setLastMilestoneReached(highestMilestoneReached)

      // Show appropriate toast based on milestone
      let title = "Milestone Reached!"
      let description = ""

      switch (highestMilestoneReached) {
        case 0:
          title = "Journey Started!"
          description = "You've begun your Cyber Essentials journey!"
          break
        case 25:
          description = "You've completed 25% of your Cyber Essentials journey!"
          break
        case 50:
          description = "Halfway there! 50% of certification requirements completed."
          break
        case 75:
          description = "Almost there! 75% of certification requirements completed."
          break
        case 100:
          title = "Congratulations!"
          description = "You've completed all Cyber Essentials requirements!"
          break
      }

      toast({
        title,
        description,
        duration: 5000,
      })

      // Trigger celebration animation
      const celebrationEvent = new CustomEvent("milestone-reached", {
        detail: { milestone: highestMilestoneReached, message: description },
      })
      window.dispatchEvent(celebrationEvent)
    }
    // Calculate the value outside the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallProgress, lastMilestoneReached])

  const handleResetClick = () => {
    setShowResetConfirmation(true)
  }

  const confirmReset = () => {
    const initialProgress: Record<string, number> = {}
    sections.forEach((section) => {
      initialProgress[section.id] = 0
    })
    setProgress(initialProgress)
    localStorage.removeItem("cyberEssentialsSteps")
    setLastMilestoneReached(0)

    toast({
      title: "Progress Reset",
      description: "Your progress has been reset to 0%",
    })

    setShowResetConfirmation(false)
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return <Shield className="h-6 w-6" />
      case "settings":
        return <Settings className="h-6 w-6" />
      case "clock":
        return <Clock className="h-6 w-6" />
      case "user":
        return <User className="h-6 w-6" />
      case "smartphone":
        return <Smartphone className="h-6 w-6" />
      case "lock":
        return <Lock className="h-6 w-6" />
      case "upload":
        return <Upload className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  // Add this handler for profile setup completion
  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false)
    setIsPersonalized(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Milestone Celebration Component */}
      <MilestoneCelebration />

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <OrganizationProfileSetup
            onComplete={handleProfileSetupComplete}
            onDismiss={() => setShowProfileSetup(false)}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Cyber Essentials Preparation</h1>
        </div>
        <div className="flex items-center gap-2">
          <RecoveryCodeModal />
          <Button variant="outline" onClick={() => setShowProfileSetup(true)} className="flex items-center gap-1">
            <Settings className="h-4 w-4" /> Personalization Settings
          </Button>
          <Button variant="outline" onClick={handleResetClick}>
            Reset Progress
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your journey to Cyber Essentials certification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Completion</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>

            {/* Replace standard progress bar with milestone progress */}
            <ProgressWithMilestones
              value={overallProgress}
              className="mb-2"
              milestones={[
                {
                  percentage: 0,
                  label: "Getting Started",
                  description: "Begin your Cyber Essentials journey",
                },
                {
                  percentage: 25,
                  label: "First Steps",
                  description: "You've begun your Cyber Essentials journey",
                },
                {
                  percentage: 50,
                  label: "Halfway There",
                  description: "You've completed half of the certification requirements",
                },
                {
                  percentage: 75,
                  label: "Almost There",
                  description: "You're well on your way to certification",
                },
                {
                  percentage: 100,
                  label: "Certification Ready",
                  description: "You've completed all certification requirements",
                },
              ]}
            />

            {/* Milestone status message */}
            <div className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
              {overallProgress === 0 && "Start your Cyber Essentials journey"}
              {overallProgress > 0 && overallProgress < 25 && "Complete 25% to reach your first milestone"}
              {overallProgress >= 25 && overallProgress < 50 && "Keep going! You're making great progress"}
              {overallProgress >= 50 && overallProgress < 75 && "You've completed half of the requirements!"}
              {overallProgress >= 75 && overallProgress < 100 && "Almost there! Just a few more steps to go"}
              {overallProgress >= 100 && "Congratulations! You've completed all requirements"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      {isPersonalized && (
        <div className="mb-8">
          <PersonalizedRecommendations progress={progress} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link href={`/section/${section.id}`} key={section.id}>
            <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{section.title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {getIcon(section.icon)}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{section.description}</CardDescription>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">
                      {progress[section.id] ? Math.round(progress[section.id]) : 0}%
                    </span>
                  </div>
                  <Progress value={progress[section.id] || 0} className="h-1" />
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-600">
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        
        <Link href="/smart-documentation" key="smart-documentation">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Smart Documentation (In development)</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">
                Auto-generate evidence collection and create dynamic documentation templates for your certification
              </CardDescription>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tools Available</span>
                  <span className="text-sm font-medium">2</span>
                </div>
                <div className="h-1 bg-gray-200 rounded-full">
                  <div className="h-1 bg-blue-600 rounded-full w-full" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600">
                Access Tools <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/upload-assessment" key="upload-assessment">
          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow border-dashed border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Assessment</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">
                Upload a spreadsheet or paste questions for automated assessment and progress analysis
              </CardDescription>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                Start Assessment <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Custom Reset Confirmation Dialog */}
      <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset your progress? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
