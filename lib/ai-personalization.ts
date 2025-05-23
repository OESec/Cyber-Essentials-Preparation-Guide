export interface OrganizationProfile {
  size: "small" | "medium" | "large" | "enterprise"
  sector: "healthcare" | "finance" | "education" | "retail" | "manufacturing" | "technology" | "government" | "other"
  technicalMaturity: "basic" | "intermediate" | "advanced"
  existingControls: string[]
  priorities: string[]
  timeline: "urgent" | "normal" | "flexible"
}

export interface PersonalizedRecommendation {
  sectionId: string
  priority: "high" | "medium" | "low"
  reason: string
  estimatedTime: string
  tips: string[]
}

export function initializePersonalization(): void {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem("cyberEssentialsProfile")
  if (!existing) {
    localStorage.setItem("cyberEssentialsProfile", JSON.stringify({}))
  }
}

export function isPersonalizationSetup(): boolean {
  if (typeof window === "undefined") return false

  const profile = localStorage.getItem("cyberEssentialsProfile")
  if (!profile) return false

  try {
    const parsed = JSON.parse(profile)
    return parsed.size && parsed.sector && parsed.technicalMaturity
  } catch {
    return false
  }
}

export function saveOrganizationProfile(profile: OrganizationProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem("cyberEssentialsProfile", JSON.stringify(profile))
}

export function getOrganizationProfile(): OrganizationProfile | null {
  if (typeof window === "undefined") return null

  const profile = localStorage.getItem("cyberEssentialsProfile")
  if (!profile) return null

  try {
    return JSON.parse(profile)
  } catch {
    return null
  }
}

export function generatePersonalizedRecommendations(
  profile: OrganizationProfile,
  progress: Record<string, number>,
): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = []

  // Priority mapping based on organization profile
  const sectorPriorities = {
    healthcare: ["access-control", "secure-configuration", "malware-protection"],
    finance: ["access-control", "malware-protection", "secure-configuration"],
    education: ["access-control", "security-update-management", "malware-protection"],
    retail: ["malware-protection", "secure-configuration", "access-control"],
    manufacturing: ["secure-configuration", "security-update-management", "access-control"],
    technology: ["secure-configuration", "access-control", "security-update-management"],
    government: ["access-control", "secure-configuration", "malware-protection"],
    other: ["access-control", "secure-configuration", "malware-protection"],
  }

  const sizePriorities = {
    small: ["access-control", "malware-protection"],
    medium: ["access-control", "secure-configuration", "malware-protection"],
    large: ["access-control", "secure-configuration", "security-update-management"],
    enterprise: ["access-control", "secure-configuration", "security-update-management", "malware-protection"],
  }

  const maturityAdjustments = {
    basic: { timeMultiplier: 1.5, focusAreas: ["access-control", "malware-protection"] },
    intermediate: { timeMultiplier: 1.2, focusAreas: ["secure-configuration", "security-update-management"] },
    advanced: { timeMultiplier: 1.0, focusAreas: ["incident-management", "monitoring"] },
  }

  // Generate recommendations for each section
  const sections = [
    { id: "access-control", name: "Access Control" },
    { id: "malware-protection", name: "Malware Protection" },
    { id: "secure-configuration", name: "Secure Configuration" },
    { id: "security-update-management", name: "Security Update Management" },
    { id: "incident-management", name: "Incident Management" },
  ]

  sections.forEach((section) => {
    const sectionProgress = progress[section.id] || 0
    const sectorPriority = sectorPriorities[profile.sector]?.includes(section.id)
    const sizePriority = sizePriorities[profile.size]?.includes(section.id)
    const maturityFocus = maturityAdjustments[profile.technicalMaturity].focusAreas.includes(section.id)

    let priority: "high" | "medium" | "low" = "medium"
    let reason = `Continue with ${section.name} implementation`

    if (sectionProgress < 25) {
      if (sectorPriority || sizePriority || maturityFocus) {
        priority = "high"
        reason = `Critical for ${profile.sector} organizations of your size`
      } else {
        priority = "medium"
        reason = `Important foundation for cyber security`
      }
    } else if (sectionProgress < 75) {
      priority = sectorPriority ? "high" : "medium"
      reason = `Good progress, continue to completion`
    } else {
      priority = "low"
      reason = `Nearly complete, finish remaining items`
    }

    const baseTime = profile.timeline === "urgent" ? 2 : profile.timeline === "normal" ? 4 : 6
    const adjustedTime = Math.ceil(baseTime * maturityAdjustments[profile.technicalMaturity].timeMultiplier)
    const estimatedTime = `${adjustedTime}-${adjustedTime + 2} hours`

    const tips = generateTipsForSection(section.id, profile)

    recommendations.push({
      sectionId: section.id,
      priority,
      reason,
      estimatedTime,
      tips,
    })
  })

  // Sort by priority and progress
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const aPriorityScore = priorityOrder[a.priority]
    const bPriorityScore = priorityOrder[b.priority]

    if (aPriorityScore !== bPriorityScore) {
      return bPriorityScore - aPriorityScore
    }

    // If same priority, sort by progress (less complete first)
    const aProgress = progress[a.sectionId] || 0
    const bProgress = progress[b.sectionId] || 0
    return aProgress - bProgress
  })
}

function generateTipsForSection(sectionId: string, profile: OrganizationProfile): string[] {
  const baseTips: Record<string, string[]> = {
    "access-control": [
      "Start with user account management",
      "Implement strong password policies",
      "Set up multi-factor authentication",
    ],
    "malware-protection": [
      "Deploy endpoint protection on all devices",
      "Configure real-time scanning",
      "Set up automatic updates",
    ],
    "secure-configuration": [
      "Review default configurations",
      "Disable unnecessary services",
      "Implement configuration baselines",
    ],
    "security-update-management": [
      "Establish patch management process",
      "Prioritize critical security updates",
      "Test updates before deployment",
    ],
    "incident-management": [
      "Create incident response plan",
      "Define roles and responsibilities",
      "Set up monitoring and alerting",
    ],
  }

  const tips = [...(baseTips[sectionId] || [])]

  // Add profile-specific tips
  if (profile.size === "small") {
    tips.push("Consider cloud-based solutions for easier management")
  } else if (profile.size === "enterprise") {
    tips.push("Implement centralized management tools")
  }

  if (profile.technicalMaturity === "basic") {
    tips.push("Start with vendor-recommended configurations")
  } else if (profile.technicalMaturity === "advanced") {
    tips.push("Consider custom configurations for your environment")
  }

  return tips.slice(0, 3) // Return top 3 tips
}
