"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface Milestone {
  percentage: number
  label: string
  description: string
}

interface ProgressWithMilestonesProps {
  value: number
  className?: string
  showLabels?: boolean
  milestones?: Milestone[]
}

export function ProgressWithMilestones({
  value,
  className,
  showLabels = true,
  milestones = [
    { percentage: 0, label: "Getting Started", description: "Begin your Cyber Essentials journey" },
    { percentage: 25, label: "First Steps", description: "You've begun your Cyber Essentials journey" },
    { percentage: 50, label: "Halfway There", description: "You've completed half of the certification requirements" },
    { percentage: 75, label: "Almost There", description: "You're well on your way to certification" },
    { percentage: 100, label: "Certification Ready", description: "You've completed all certification requirements" },
  ],
}: ProgressWithMilestonesProps) {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Progress value={value} className={cn("h-3 rounded-full", className)} />

        {/* Milestone markers */}
        <div className="absolute inset-0">
          {milestones.map((milestone, index) => {
            const isReached = value >= milestone.percentage
            const leftPosition = `${milestone.percentage}%`

            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300",
                        isReached ? "scale-110" : "opacity-70",
                        hoveredMilestone === index ? "scale-125" : "",
                      )}
                      style={{ left: leftPosition }}
                      onMouseEnter={() => setHoveredMilestone(index)}
                      onMouseLeave={() => setHoveredMilestone(null)}
                    >
                      {isReached ? (
                        milestone.percentage === 100 ? (
                          <Trophy
                            className={cn(
                              "h-5 w-5 text-yellow-500 drop-shadow-md",
                              isReached && "animate-pulse-subtle",
                            )}
                          />
                        ) : (
                          <CheckCircle2
                            className={cn("h-4 w-4 text-green-500 drop-shadow-md", isReached && "animate-pulse-subtle")}
                          />
                        )
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-center">
                    <p className="font-medium">{milestone.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{milestone.description}</p>
                    <p className="text-xs font-medium mt-1">{milestone.percentage}% Complete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>

      {/* Milestone labels (optional) */}
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={cn(
                "transition-colors duration-300",
                value >= milestone.percentage ? "text-green-600 dark:text-green-400 font-medium" : "",
              )}
              style={{ width: index === 0 ? "auto" : index === milestones.length - 1 ? "auto" : "auto" }}
            >
              {milestone.percentage}%
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
