"use client"

import type React from "react"

interface Step {
  id: string
  title: string
  description: string
}

interface PlatformStepsProps {
  platform: {
    id: string
    name: string
    steps: Step[]
  }
  questionId: string // Add questionId to props
  completedSteps: string[]
  excludedPlatforms: string[]
  onToggleStep: (stepId: string) => void
  onTogglePlatform: (platformId: string, excluded: boolean) => void
}

const PlatformSteps: React.FC<PlatformStepsProps> = ({
  platform,
  questionId, // Use questionId in component
  completedSteps,
  excludedPlatforms,
  onToggleStep,
  onTogglePlatform,
}) => {
  const isExcluded = excludedPlatforms.includes(platform.id)
  // Create a truly unique ID using both question and platform IDs
  const uniqueToggleId = `toggle-${questionId}-${platform.id}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="relative inline-block w-10 h-5 mr-2">
            <input
              type="checkbox"
              className="opacity-0 w-0 h-0"
              checked={!isExcluded}
              onChange={(e) => onTogglePlatform(platform.id, !e.target.checked)}
              id={uniqueToggleId}
            />
            <label
              htmlFor={uniqueToggleId}
              className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full ${
                !isExcluded ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-800"
              }`}
            >
              <span
                className={`absolute left-0.5 bottom-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                  !isExcluded ? "translate-x-5" : ""
                }`}
              ></span>
            </label>
          </div>
          <span>{!isExcluded ? "Applicable to my organization" : "Not Applicable (Excluded)"}</span>
          {isExcluded && (
            <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded">
              Not scored
            </span>
          )}
        </div>
      </div>

      {!isExcluded ? (
        <div className="space-y-3">
          <h4 className="font-medium">Setup Steps</h4>
          {platform.steps.map((step) => (
            <div key={step.id} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={completedSteps.includes(step.id)}
                onChange={() => onToggleStep(step.id)}
                className="mt-1"
              />
              <div>
                <h5 className="font-medium">{step.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 dark:bg-opacity-50 p-4 text-center text-gray-500 dark:text-gray-300 rounded">
          This platform has been marked as not applicable to your organization and will not be included in scoring.
        </div>
      )}
    </div>
  )
}

export { PlatformSteps }
