"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Trophy } from "lucide-react"

export function MilestoneCelebration() {
  const [lastMilestoneReached, setLastMilestoneReached] = useLocalStorage<number>("lastMilestoneReached", 0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Define milestones
  const milestones = [
    { threshold: 25, message: "You've completed 25% of your Cyber Essentials journey!" },
    { threshold: 50, message: "Halfway there! 50% of certification requirements completed." },
    { threshold: 75, message: "Almost there! 75% of certification requirements completed." },
    { threshold: 100, message: "Congratulations! You've completed all Cyber Essentials requirements!" },
  ]

  useEffect(() => {
    setIsClient(true)

    // Calculate overall progress
    const progressData = localStorage.getItem("cyberEssentialsProgress")
    if (progressData) {
      const progress = JSON.parse(progressData)
      const values = Object.values(progress) as number[]
      if (values.length > 0) {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length
        setOverallProgress(average)
      }
    }
  }, [])

  // Check for milestone achievements
  useEffect(() => {
    if (!isClient) return

    // Find the highest milestone reached
    const highestMilestoneReached = milestones.reduce((highest, milestone) => {
      return overallProgress >= milestone.threshold ? milestone.threshold : highest
    }, 0)

    // If we've reached a new milestone, show a celebration
    if (highestMilestoneReached > lastMilestoneReached) {
      setLastMilestoneReached(highestMilestoneReached)

      // Find the milestone message
      const milestone = milestones.find((m) => m.threshold === highestMilestoneReached)
      if (milestone) {
        setMilestoneMessage(milestone.message)
        setShowCelebration(true)

        // Trigger confetti
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now()

          if (timeLeft <= 0) {
            return clearInterval(interval)
          }

          const particleCount = 50 * (timeLeft / duration)

          // Since they are random, these confetti will sometimes go outside the viewport
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        }, 250)

        // Hide celebration after a few seconds
        setTimeout(() => {
          setShowCelebration(false)
        }, 5000)
      }
    }
  }, [overallProgress, lastMilestoneReached, isClient, setLastMilestoneReached, milestones])

  // Don't render anything on the server
  if (!isClient) {
    return null
  }

  if (!showCelebration) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-slide-in bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-4 text-center border-2 border-blue-500 dark:border-blue-400">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse-subtle" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Milestone Achieved!</h3>
        <p className="text-gray-600 dark:text-gray-300">{milestoneMessage}</p>
      </div>
    </div>
  )
}
