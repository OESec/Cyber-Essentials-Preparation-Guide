"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react"

interface ReadinessFactor {
  name: string
  score: number
  weight: number
  status: "excellent" | "good" | "needs-attention" | "critical"
  description: string
}

export function CertificationReadinessScore() {
  const [overallScore, setOverallScore] = useState(0)
  const [factors, setFactors] = useState<ReadinessFactor[]>([
    {
      name: "Overall Completion",
      score: 0,
      weight: 0.3,
      status: "critical",
      description: "Percentage of all security steps completed",
    },
    {
      name: "Critical Controls",
      score: 0,
      weight: 0.25,
      status: "critical",
      description: "Essential security controls implementation",
    },
    {
      name: "Progress Consistency",
      score: 0,
      weight: 0.15,
      status: "needs-attention",
      description: "Regular engagement with security tasks",
    },
    {
      name: "Configuration Depth",
      score: 0,
      weight: 0.1,
      status: "good",
      description: "Advanced security configurations completed",
    },
    {
      name: "Documentation Quality",
      score: 0,
      weight: 0.1,
      status: "needs-attention",
      description: "Evidence and documentation completeness",
    },
    {
      name: "Recent Activity",
      score: 0,
      weight: 0.1,
      status: "good",
      description: "Recent progress and engagement",
    },
  ])

  const [readinessLevel, setReadinessLevel] = useState<
    "not-ready" | "getting-ready" | "nearly-ready" | "certification-ready"
  >("not-ready")
  const [estimatedDays, setEstimatedDays] = useState(0)

  useEffect(() => {
    calculateReadinessScore()
  }, [])

  const calculateReadinessScore = () => {
    const completedSteps = JSON.parse(localStorage.getItem("cyberEssentialsSteps") || "{}")
    const progress = JSON.parse(localStorage.getItem("cyberEssentialsProgress") || "{}")
    const activityDates = JSON.parse(localStorage.getItem("cyberEssentialsActivityDates") || "[]")

    // Calculate overall completion
    const totalSteps = Object.values(completedSteps).flat().length
    const completionScore = Math.min(totalSteps * 2, 100) // Assume 50 total steps for 100%

    // Calculate critical controls (firewall, access control, malware protection)
    const criticalSections = ["firewall", "access-control", "malware-protection"]
    const criticalProgress =
      criticalSections.reduce((sum, section) => sum + (progress[section] || 0), 0) / criticalSections.length

    // Calculate consistency (based on activity frequency)
    const consistencyScore = Math.min(activityDates.length * 10, 100)

    // Calculate configuration depth (advanced steps completed)
    const configScore = Math.min(totalSteps * 3, 100) // Weighted for complexity

    // Calculate documentation quality (mock calculation)
    const docScore = Math.min(totalSteps * 2.5, 100)

    // Calculate recent activity
    const lastActivity = localStorage.getItem("cyberEssentialsLastActivity")
    const daysSinceActivity = lastActivity
      ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      : 30
    const recentActivityScore = Math.max(100 - daysSinceActivity * 10, 0)

    const updatedFactors = [
      { ...factors[0], score: completionScore, status: getStatus(completionScore) },
      { ...factors[1], score: criticalProgress, status: getStatus(criticalProgress) },
      { ...factors[2], score: consistencyScore, status: getStatus(consistencyScore) },
      { ...factors[3], score: configScore, status: getStatus(configScore) },
      { ...factors[4], score: docScore, status: getStatus(docScore) },
      { ...factors[5], score: recentActivityScore, status: getStatus(recentActivityScore) },
    ]

    setFactors(updatedFactors)

    // Calculate weighted overall score
    const weightedScore = updatedFactors.reduce((sum, factor) => sum + factor.score * factor.weight, 0)
    setOverallScore(Math.round(weightedScore))

    // Determine readiness level and estimate
    if (weightedScore >= 90) {
      setReadinessLevel("certification-ready")
      setEstimatedDays(0)
    } else if (weightedScore >= 75) {
      setReadinessLevel("nearly-ready")
      setEstimatedDays(Math.ceil((90 - weightedScore) * 2))
    } else if (weightedScore >= 50) {
      setReadinessLevel("getting-ready")
      setEstimatedDays(Math.ceil((90 - weightedScore) * 3))
    } else {
      setReadinessLevel("not-ready")
      setEstimatedDays(Math.ceil((90 - weightedScore) * 4))
    }
  }

  const getStatus = (score: number): "excellent" | "good" | "needs-attention" | "critical" => {
    if (score >= 90) return "excellent"
    if (score >= 75) return "good"
    if (score >= 50) return "needs-attention"
    return "critical"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "needs-attention":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getReadinessColor = () => {
    switch (readinessLevel) {
      case "certification-ready":
        return "text-green-600 dark:text-green-400"
      case "nearly-ready":
        return "text-blue-600 dark:text-blue-400"
      case "getting-ready":
        return "text-yellow-600 dark:text-yellow-400"
      case "not-ready":
        return "text-red-600 dark:text-red-400"
    }
  }

  const getReadinessMessage = () => {
    switch (readinessLevel) {
      case "certification-ready":
        return "You're ready for certification!"
      case "nearly-ready":
        return "Almost ready - just a few more steps"
      case "getting-ready":
        return "Good progress - keep going"
      case "not-ready":
        return "Getting started - focus on critical areas"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Certification Readiness
        </CardTitle>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{overallScore}%</div>
          <div className={`text-sm font-medium ${getReadinessColor()}`}>{getReadinessMessage()}</div>
          {estimatedDays > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Estimated {estimatedDays} days to certification readiness
            </div>
          )}
        </div>
        <Progress value={overallScore} className="mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Readiness Factors
          </h4>
          {factors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(factor.status)}
                  <span className="text-sm font-medium">{factor.name}</span>
                  <Badge variant="outline" className={getStatusColor(factor.status)}>
                    {factor.status.replace("-", " ")}
                  </Badge>
                </div>
                <span className="text-sm font-medium">{Math.round(factor.score)}%</span>
              </div>
              <Progress value={factor.score} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-300">{factor.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps</h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            {overallScore < 50 && <li>• Focus on completing critical security controls</li>}
            {overallScore < 75 && <li>• Maintain consistent daily progress</li>}
            {overallScore < 90 && <li>• Complete advanced configuration steps</li>}
            <li>• Review and organize your evidence documentation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
