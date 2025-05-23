"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ProgressRadarChart } from "@/components/progress-radar-chart"
import { AchievementSystem } from "@/components/gamification/achievement-system"
import { CertificationReadinessScore } from "@/components/gamification/certification-readiness-score"

export default function Analytics() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
        </div>
      </div>

      {/* Progress Radar Chart */}
      <div className="mb-8">
        <ProgressRadarChart />
      </div>

      {/* Gamification Elements */}
      <div className="grid gap-6 md:grid-cols-2">
        <AchievementSystem />
        <CertificationReadinessScore />
      </div>
    </div>
  )
}
