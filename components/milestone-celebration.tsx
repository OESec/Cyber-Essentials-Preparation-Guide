"use client"

import { useEffect, useState } from "react"
import { Trophy, Star, Target, Award } from "lucide-react"

export function MilestoneCelebration() {
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestone, setMilestone] = useState<number>(0)
  const [celebrationMessage, setCelebrationMessage] = useState("")

  useEffect(() => {
    // Listen for milestone events
    const handleMilestone = (event: CustomEvent) => {
      const { milestone: newMilestone, message } = event.detail
      setMilestone(newMilestone)
      setCelebrationMessage(message)
      setShowCelebration(true)

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setShowCelebration(false)
      }, 4000)
    }

    window.addEventListener("milestone-reached", handleMilestone as EventListener)

    return () => {
      window.removeEventListener("milestone-reached", handleMilestone as EventListener)
    }
  }, [])

  const getMilestoneIcon = () => {
    switch (milestone) {
      case 25:
        return <Target className="h-8 w-8 text-yellow-500" />
      case 50:
        return <Star className="h-8 w-8 text-blue-500" />
      case 75:
        return <Trophy className="h-8 w-8 text-purple-500" />
      case 100:
        return <Award className="h-8 w-8 text-green-500" />
      default:
        return <Star className="h-8 w-8 text-blue-500" />
    }
  }

  const getMilestoneColor = () => {
    switch (milestone) {
      case 25:
        return "from-yellow-400 to-orange-500"
      case 50:
        return "from-blue-400 to-blue-600"
      case 75:
        return "from-purple-400 to-purple-600"
      case 100:
        return "from-green-400 to-green-600"
      default:
        return "from-blue-400 to-blue-600"
    }
  }

  if (!showCelebration) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Confetti Animation */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"][Math.floor(Math.random() * 5)],
              }}
            />
          </div>
        ))}
      </div>

      {/* Celebration Card */}
      <div
        className={`bg-gradient-to-r ${getMilestoneColor()} p-8 rounded-2xl shadow-2xl text-white text-center transform animate-pulse max-w-md mx-4`}
      >
        <div className="flex justify-center mb-4">{getMilestoneIcon()}</div>
        <h2 className="text-2xl font-bold mb-2">{milestone === 100 ? "Congratulations!" : "Milestone Reached!"}</h2>
        <p className="text-lg mb-4">{celebrationMessage}</p>
        <div className="text-3xl font-bold">{milestone}% Complete!</div>
      </div>
    </div>
  )
}
