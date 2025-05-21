import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Platform } from "@/lib/data"

interface PlatformStepsProps {
  platform: Platform
  completedSteps: string[]
  excludedPlatforms: string[]
  onToggleStep: (stepId: string) => void
  onTogglePlatform: (platformId: string, excluded: boolean) => void
}

export function PlatformSteps({
  platform,
  completedSteps,
  excludedPlatforms,
  onToggleStep,
  onTogglePlatform,
}: PlatformStepsProps) {
  const isPlatformExcluded = excludedPlatforms.includes(platform.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Switch
            id={`exclude-${platform.id}`}
            checked={!isPlatformExcluded}
            onCheckedChange={(checked) => onTogglePlatform(platform.id, !checked)}
          />
          <Label htmlFor={`exclude-${platform.id}`} className="text-sm font-medium">
            {isPlatformExcluded ? "Not Applicable (Excluded)" : "Applicable to my organization"}
          </Label>
        </div>
        {isPlatformExcluded && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
            Not scored
          </span>
        )}
      </div>

      {!isPlatformExcluded ? (
        platform.steps.map((step) => (
          <div
            key={step.id}
            className="flex items-start space-x-3 p-3 rounded-md dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Checkbox
              id={step.id}
              checked={completedSteps.includes(step.id)}
              onCheckedChange={() => onToggleStep(step.id)}
              className="mt-1"
            />
            <div className="space-y-1">
              <label htmlFor={step.id} className="font-medium cursor-pointer dark:text-gray-100">
                {step.title}
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              {step.image && (
                <div className="mt-2">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    className="rounded-md border border-gray-200 dark:border-gray-700 max-w-full"
                  />
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-center">
          <p className="text-gray-500 dark:text-gray-400">
            This platform has been marked as not applicable to your organization and will not be included in scoring.
          </p>
        </div>
      )}
    </div>
  )
}
