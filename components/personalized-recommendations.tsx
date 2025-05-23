"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Target, TrendingUp, Lightbulb, ArrowRight } from "lucide-react"
import {
  getOrganizationProfile,
  generatePersonalizedRecommendations,
  type PersonalizedRecommendation,
} from "@/lib/ai-personalization"
import Link from "next/link"

interface PersonalizedRecommendationsProps {
  progress: Record<string, number>
}

export function PersonalizedRecommendations({ progress }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const orgProfile = getOrganizationProfile()
    if (orgProfile) {
      setProfile(orgProfile)
      const recs = generatePersonalizedRecommendations(orgProfile, progress)
      setRecommendations(recs.slice(0, 3)) // Show top 3 recommendations
    }
  }, [progress])

  if (!profile || recommendations.length === 0) {
    return null
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSectionName = (sectionId: string) => {
    const sectionNames: Record<string, string> = {
      "access-control": "Access Control",
      "malware-protection": "Malware Protection",
      "secure-configuration": "Secure Configuration",
      "security-update-management": "Security Update Management",
      "incident-management": "Incident Management",
    }
    return sectionNames[sectionId] || sectionId
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <CardTitle>Personalized Recommendations</CardTitle>
        </div>
        <CardDescription>
          Based on your organization profile: {profile.size} {profile.sector} company with {profile.technicalMaturity}{" "}
          technical maturity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={rec.sectionId} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{getSectionName(rec.sectionId)}</h4>
                    <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {rec.estimatedTime}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Recommended Actions:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {rec.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">{Math.round(progress[rec.sectionId] || 0)}% complete</span>
                </div>
                <Link href={`/section/${rec.sectionId}`}>
                  <Button size="sm" className="flex items-center gap-1">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
