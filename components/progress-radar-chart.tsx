"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Shield, Settings, Clock, User, Lock } from "lucide-react"

// Define the technical control categories
const technicalControls = [
  { id: "firewalls", name: "Firewalls", icon: Shield },
  { id: "secure-configuration", name: "Secure Configuration", icon: Settings },
  { id: "security-updates", name: "Security Updates", icon: Clock },
  { id: "user-access", name: "User Access", icon: User },
  { id: "malware-protection", name: "Malware Protection", icon: Lock },
]

export function ProgressRadarChart() {
  const [progress, setProgress] = useLocalStorage<Record<string, number>>("cyberEssentialsProgress", {})
  const [activeView, setActiveView] = useState<"radar" | "bar">("radar")
  const [chartData, setChartData] = useState<{ id: string; name: string; progress: number; color: string }[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Map the technical controls to their progress values
    const data = technicalControls.map((control, index) => {
      // Get progress for this control (default to 0 if not found)
      const controlProgress = progress[control.id] || 0

      // Assign a color from our palette
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"]

      return {
        id: control.id,
        name: control.name,
        progress: controlProgress,
        color: colors[index % colors.length],
      }
    })

    setChartData(data)
  }, [progress])

  // Don't render anything on the server
  if (!isClient) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Controls Progress</CardTitle>
        <CardDescription>Visualize your progress across the five Cyber Essentials technical controls</CardDescription>
        <Tabs
          defaultValue="radar"
          value={activeView}
          onValueChange={(value) => setActiveView(value as "radar" | "bar")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="radar">Radar View</TabsTrigger>
            <TabsTrigger value="bar">Bar View</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {activeView === "radar" ? (
            <div className="relative h-full w-full">
              {/* Radar Chart Background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[80%] w-[80%] rounded-full border border-dashed border-gray-200 dark:border-gray-700 opacity-20"></div>
                <div className="absolute h-[60%] w-[60%] rounded-full border border-dashed border-gray-200 dark:border-gray-700 opacity-40"></div>
                <div className="absolute h-[40%] w-[40%] rounded-full border border-dashed border-gray-200 dark:border-gray-700 opacity-60"></div>
                <div className="absolute h-[20%] w-[20%] rounded-full border border-dashed border-gray-200 dark:border-gray-700 opacity-80"></div>
              </div>

              {/* Radar Chart Data Points */}
              <div className="absolute inset-0">
                <svg className="h-full w-full" viewBox="0 0 200 200">
                  <g transform="translate(100, 100)">
                    {/* Draw the radar polygon */}
                    <path
                      d={
                        chartData
                          .map((point, i) => {
                            // Calculate position on the radar
                            const angle = (Math.PI * 2 * i) / chartData.length
                            const radius = (point.progress / 100) * 80
                            const x = Math.sin(angle) * radius
                            const y = -Math.cos(angle) * radius
                            return `${i === 0 ? "M" : "L"}${x},${y}`
                          })
                          .join(" ") + "Z"
                      }
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="transition-all duration-500 ease-in-out"
                    />

                    {/* Draw the data points */}
                    {chartData.map((point, i) => {
                      const angle = (Math.PI * 2 * i) / chartData.length
                      const radius = (point.progress / 100) * 80
                      const x = Math.sin(angle) * radius
                      const y = -Math.cos(angle) * radius

                      return (
                        <g key={point.id} className="transition-all duration-500 ease-in-out">
                          <circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill={point.color}
                            className="transition-all duration-500 ease-in-out"
                          />
                          <line
                            x1="0"
                            y1="0"
                            x2={Math.sin(angle) * 80}
                            y2={-Math.cos(angle) * 80}
                            stroke="rgba(156, 163, 175, 0.2)"
                            strokeWidth="1"
                          />
                          <text
                            x={Math.sin(angle) * 90}
                            y={-Math.cos(angle) * 90}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="currentColor"
                            fontSize="8"
                            fontWeight="bold"
                            className="text-xs"
                          >
                            {point.name}
                          </text>
                        </g>
                      )
                    })}
                  </g>
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center space-y-4">
              {chartData.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {(() => {
                        const Icon = technicalControls.find((c) => c.id === item.id)?.icon || Shield
                        return <Icon className="mr-2 h-4 w-4" style={{ color: item.color }} />
                      })()}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{Math.round(item.progress)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
