"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Zap, Award, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  points: number
  category: "progress" | "consistency" | "difficulty" | "special"
  unlocked: boolean
  unlockedAt?: Date
}

export function AchievementSystem() {
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-step",
      title: "First Steps",
      description: "Complete your first security step",
      icon: <CheckCircle className="h-4 w-4" />,
      points: 10,
      category: "progress",
      unlocked: false,
    },
    {
      id: "section-complete",
      title: "Section Master",
      description: "Complete an entire section",
      icon: <Target className="h-4 w-4" />,
      points: 25,
      category: "progress",
      unlocked: false,
    },
    {
      id: "halfway-hero",
      title: "Halfway Hero",
      description: "Complete 50% of all sections",
      icon: <Star className="h-4 w-4" />,
      points: 50,
      category: "progress",
      unlocked: false,
    },
    {
      id: "cyber-champion",
      title: "Cyber Champion",
      description: "Complete all sections",
      icon: <Trophy className="h-4 w-4" />,
      points: 100,
      category: "progress",
      unlocked: false,
    },
    {
      id: "streak-starter",
      title: "Streak Starter",
      description: "Work on security for 3 consecutive days",
      icon: <Zap className="h-4 w-4" />,
      points: 20,
      category: "consistency",
      unlocked: false,
    },
    {
      id: "dedicated-defender",
      title: "Dedicated Defender",
      description: "Work on security for 7 consecutive days",
      icon: <Award className="h-4 w-4" />,
      points: 40,
      category: "consistency",
      unlocked: false,
    },
  ])

  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    // Load achievements from localStorage
    const savedAchievements = localStorage.getItem("cyberEssentialsAchievements")
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }

    const savedPoints = localStorage.getItem("cyberEssentialsPoints")
    if (savedPoints) {
      setTotalPoints(Number.parseInt(savedPoints))
    }

    // Check for new achievements
    checkAchievements()
  }, [])

  const checkAchievements = () => {
    const completedSteps = localStorage.getItem("cyberEssentialsSteps")
    const progress = localStorage.getItem("cyberEssentialsProgress")
    const lastActivity = localStorage.getItem("cyberEssentialsLastActivity")

    if (completedSteps) {
      const steps = JSON.parse(completedSteps)
      const totalSteps = Object.values(steps).flat().length

      // Check progress achievements
      if (totalSteps > 0) {
        unlockAchievement("first-step")
      }

      if (totalSteps >= 20) {
        unlockAchievement("halfway-hero")
      }
    }

    if (progress) {
      const progressData = JSON.parse(progress)
      const completedSections = Object.values(progressData).filter((p: any) => p >= 100).length

      if (completedSections >= 1) {
        unlockAchievement("section-complete")
      }

      if (completedSections >= 5) {
        unlockAchievement("cyber-champion")
      }
    }

    // Check consistency achievements
    checkConsistencyAchievements()
  }

  const checkConsistencyAchievements = () => {
    const activityDates = JSON.parse(localStorage.getItem("cyberEssentialsActivityDates") || "[]")

    if (activityDates.length >= 3) {
      unlockAchievement("streak-starter")
    }

    if (activityDates.length >= 7) {
      unlockAchievement("dedicated-defender")
    }
  }

  const unlockAchievement = (achievementId: string) => {
    setAchievements((prev) => {
      const updated = prev.map((achievement) => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(),
          }

          // Show toast notification
          toast({
            title: "🏆 Achievement Unlocked!",
            description: `${achievement.title} - ${achievement.description}`,
          })

          // Update points
          setTotalPoints((prevPoints) => {
            const newTotal = prevPoints + achievement.points
            localStorage.setItem("cyberEssentialsPoints", newTotal.toString())
            return newTotal
          })

          return unlockedAchievement
        }
        return achievement
      })

      // Save to localStorage
      localStorage.setItem("cyberEssentialsAchievements", JSON.stringify(updated))
      return updated
    })
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const completionPercentage = (unlockedAchievements.length / achievements.length) * 100

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "consistency":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "difficulty":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "special":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievements
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>
            {unlockedAchievements.length}/{achievements.length} unlocked
          </span>
          <span>{totalPoints} points earned</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                achievement.unlocked
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  achievement.unlocked ? "bg-green-100 dark:bg-green-800" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <Badge variant="secondary" className={getCategoryColor(achievement.category)}>
                    {achievement.category}
                  </Badge>
                  <Badge variant="outline">{achievement.points} pts</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                {achievement.unlockedAt && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
