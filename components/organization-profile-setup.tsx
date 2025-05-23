"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Building, Users, Settings, Target, Clock, X } from "lucide-react"
import { type OrganizationProfile, saveOrganizationProfile } from "@/lib/ai-personalization"

interface OrganizationProfileSetupProps {
  onComplete: () => void
  onDismiss: () => void
}

export function OrganizationProfileSetup({ onComplete, onDismiss }: OrganizationProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<OrganizationProfile>>({
    existingControls: [],
    priorities: [],
  })

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save profile and complete setup
      saveOrganizationProfile(profile as OrganizationProfile)
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!profile.size
      case 2:
        return !!profile.sector
      case 3:
        return !!profile.technicalMaturity
      case 4:
        return profile.priorities && profile.priorities.length > 0
      case 5:
        return !!profile.timeline
      default:
        return false
    }
  }

  const handleControlToggle = (control: string, checked: boolean) => {
    const currentControls = profile.existingControls || []
    if (checked) {
      setProfile({
        ...profile,
        existingControls: [...currentControls, control],
      })
    } else {
      setProfile({
        ...profile,
        existingControls: currentControls.filter((c) => c !== control),
      })
    }
  }

  const handlePriorityToggle = (priority: string, checked: boolean) => {
    const currentPriorities = profile.priorities || []
    if (checked) {
      setProfile({
        ...profile,
        priorities: [...currentPriorities, priority],
      })
    } else {
      setProfile({
        ...profile,
        priorities: currentPriorities.filter((p) => p !== priority),
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8"
        onClick={onDismiss}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <div>
            <CardTitle>Organization Profile Setup</CardTitle>
            <CardDescription>
              Help us personalize your Cyber Essentials journey (Step {step} of {totalSteps})
            </CardDescription>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <Label className="text-lg font-medium">Organization Size</Label>
            </div>
            <RadioGroup value={profile.size} onValueChange={(value) => setProfile({ ...profile, size: value as any })}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">Small (1-50 employees)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium (51-250 employees)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">Large (251-1000 employees)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="enterprise" />
                <Label htmlFor="enterprise">Enterprise (1000+ employees)</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <Label className="text-lg font-medium">Industry Sector</Label>
            </div>
            <RadioGroup
              value={profile.sector}
              onValueChange={(value) => setProfile({ ...profile, sector: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="healthcare" id="healthcare" />
                <Label htmlFor="healthcare">Healthcare</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="finance" id="finance" />
                <Label htmlFor="finance">Finance & Banking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="education" id="education" />
                <Label htmlFor="education">Education</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="retail" id="retail" />
                <Label htmlFor="retail">Retail & E-commerce</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manufacturing" id="manufacturing" />
                <Label htmlFor="manufacturing">Manufacturing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technology" id="technology" />
                <Label htmlFor="technology">Technology</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="government" id="government" />
                <Label htmlFor="government">Government</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <Label className="text-lg font-medium">Technical Maturity Level</Label>
            </div>
            <RadioGroup
              value={profile.technicalMaturity}
              onValueChange={(value) => setProfile({ ...profile, technicalMaturity: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <div>
                  <Label htmlFor="basic" className="font-medium">
                    Basic
                  </Label>
                  <p className="text-sm text-gray-600">Limited IT resources, mostly manual processes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <div>
                  <Label htmlFor="intermediate" className="font-medium">
                    Intermediate
                  </Label>
                  <p className="text-sm text-gray-600">Some automation, dedicated IT staff</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <div>
                  <Label htmlFor="advanced" className="font-medium">
                    Advanced
                  </Label>
                  <p className="text-sm text-gray-600">Highly automated, security-focused IT team</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <Label className="text-lg font-medium">Certification Priorities</Label>
            </div>
            <p className="text-sm text-gray-600">Select your main goals for Cyber Essentials certification:</p>
            <div className="space-y-3">
              {[
                { id: "compliance", label: "Regulatory Compliance", desc: "Meet legal or contractual requirements" },
                {
                  id: "insurance",
                  label: "Insurance Requirements",
                  desc: "Reduce premiums or meet policy requirements",
                },
                { id: "customer-trust", label: "Customer Trust", desc: "Demonstrate security commitment to clients" },
                { id: "risk-reduction", label: "Risk Reduction", desc: "Improve overall security posture" },
                { id: "competitive-advantage", label: "Competitive Advantage", desc: "Stand out in the marketplace" },
              ].map((priority) => (
                <div key={priority.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={priority.id}
                    checked={profile.priorities?.includes(priority.id) || false}
                    onCheckedChange={(checked) => handlePriorityToggle(priority.id, checked as boolean)}
                  />
                  <div>
                    <Label htmlFor={priority.id} className="font-medium">
                      {priority.label}
                    </Label>
                    <p className="text-sm text-gray-600">{priority.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <Label className="text-lg font-medium">Implementation Timeline</Label>
            </div>
            <RadioGroup
              value={profile.timeline}
              onValueChange={(value) => setProfile({ ...profile, timeline: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <div>
                  <Label htmlFor="urgent" className="font-medium">
                    Urgent (1-2 months)
                  </Label>
                  <p className="text-sm text-gray-600">Need certification quickly</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <div>
                  <Label htmlFor="normal" className="font-medium">
                    Normal (3-6 months)
                  </Label>
                  <p className="text-sm text-gray-600">Standard implementation timeline</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flexible" id="flexible" />
                <div>
                  <Label htmlFor="flexible" className="font-medium">
                    Flexible (6+ months)
                  </Label>
                  <p className="text-sm text-gray-600">Can take time to implement properly</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isStepValid()} className="flex items-center gap-2">
            {step === totalSteps ? "Complete Setup" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
