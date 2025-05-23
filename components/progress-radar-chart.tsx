"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Radar } from "lucide-react"
import { sections } from "@/lib/data"

export function ProgressRadarChart() {
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [viewMode, setViewMode] = useState<"radar" | "bar">("radar")

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("cyberEssentialsProgress")
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (error) {
        console.error("Error parsing progress data:", error)
      }
    }
  }, [])

  const sectionData = sections.map((section) => ({
    id: section.id,
    title: section.title,
    progress: progress[section.id] || 0,
    icon: section.icon,
  }))

  const maxValue = 100
  const centerX = 150
  const centerY = 150
  const radius = 100

  const getPointOnCircle = (angle: number, value: number) => {
    const radian = (angle - 90) * (Math.PI / 180)
    const r = (value / maxValue) * radius
    return {
      x: centerX + r * Math.cos(radian),
      y: centerY + r * Math.sin(radian),
    }
  }

  const createRadarPath = () => {
    const points = sectionData.map((section, index) => {
      const angle = (index * 360) / sectionData.length
      return getPointOnCircle(angle, section.progress)
    })

    return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z"
  }

  const createGridLines = () => {
    const lines = []
    const gridLevels = [20, 40, 60, 80, 100]

    // Concentric circles
    gridLevels.forEach((level) => {
      const r = (level / maxValue) * radius
      lines.push(
        <circle key={`grid-${level}`} cx={centerX} cy={centerY} r={r} fill="none" stroke="#e5e7eb" strokeWidth="1" />,
      )
    })

    // Radial lines
    sectionData.forEach((_, index) => {
      const angle = (index * 360) / sectionData.length
      const endPoint = getPointOnCircle(angle, 100)
      lines.push(
        <line
          key={`radial-${index}`}
          x1={centerX}
          y1={centerY}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke="#e5e7eb"
          strokeWidth="1"
        />,
      )
    })

    return lines
  }

  const createLabels = () => {
    return sectionData.map((section, index) => {
      const angle = (index * 360) / sectionData.length
      const labelPoint = getPointOnCircle(angle, 110)

      return (
        <g key={`label-${section.id}`}>
          <text
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-gray-700"
          >
            {section.title.split(" ").map((word, i) => (
              <tspan key={i} x={labelPoint.x} dy={i === 0 ? 0 : 12}>
                {word}
              </tspan>
            ))}
          </text>
          <text
            x={labelPoint.x}
            y={labelPoint.y + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-blue-600"
          >
            {Math.round(section.progress)}%
          </text>
        </g>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5" />
              Progress Visualization
            </CardTitle>
            <CardDescription>Visual overview of your progress across all five technical controls</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "radar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("radar")}
              className="flex items-center gap-1"
            >
              <Radar className="h-4 w-4" />
              Radar
            </Button>
            <Button
              variant={viewMode === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bar")}
              className="flex items-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "radar" ? (
          <div className="flex justify-center">
            <svg width="300" height="300" className="overflow-visible">
              {createGridLines()}
              <path d={createRadarPath()} fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
              {sectionData.map((section, index) => {
                const angle = (index * 360) / sectionData.length
                const point = getPointOnCircle(angle, section.progress)
                return (
                  <circle
                    key={`point-${section.id}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
              {createLabels()}
            </svg>
          </div>
        ) : (
          <div className="space-y-4">
            {sectionData.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{section.title}</span>
                  <span className="text-sm text-gray-600">{Math.round(section.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${section.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
