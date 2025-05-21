import { sections, getQuestionsBySection } from "@/lib/data"

// Types for our knowledge base entries
type KnowledgeEntry = {
  id: string
  content: string
  metadata: {
    type: "section" | "question" | "platform" | "step"
    sectionId?: string
    questionId?: string
    platformId?: string
    stepId?: string
    title?: string
  }
}

// Build a knowledge base from our data
export function buildKnowledgeBase(): KnowledgeEntry[] {
  const knowledgeBase: KnowledgeEntry[] = []

  // Add sections to knowledge base
  sections.forEach((section) => {
    knowledgeBase.push({
      id: `section-${section.id}`,
      content: `${section.title}: ${section.description}`,
      metadata: {
        type: "section",
        sectionId: section.id,
        title: section.title,
      },
    })

    // Get questions for this section
    const questions = getQuestionsBySection(section.id)

    // Add questions to knowledge base
    questions.forEach((question) => {
      let questionContent = `${question.title} ${question.description}`
      if (question.note) {
        questionContent += ` Note: ${question.note}`
      }

      knowledgeBase.push({
        id: `question-${question.id}`,
        content: questionContent,
        metadata: {
          type: "question",
          sectionId: section.id,
          questionId: question.id,
          title: question.title,
        },
      })

      // Add platforms to knowledge base
      question.platforms.forEach((platform) => {
        knowledgeBase.push({
          id: `platform-${question.id}-${platform.id}`,
          content: `Platform ${platform.name} for question "${question.title}"`,
          metadata: {
            type: "platform",
            sectionId: section.id,
            questionId: question.id,
            platformId: platform.id,
            title: platform.name,
          },
        })

        // Add steps to knowledge base
        platform.steps.forEach((step) => {
          knowledgeBase.push({
            id: `step-${question.id}-${platform.id}-${step.id}`,
            content: `${step.title}: ${step.description}`,
            metadata: {
              type: "step",
              sectionId: section.id,
              questionId: question.id,
              platformId: platform.id,
              stepId: step.id,
              title: step.title,
            },
          })
        })
      })
    })
  })

  return knowledgeBase
}

// Simple vector search using string similarity
export function searchKnowledgeBase(query: string, knowledgeBase: KnowledgeEntry[], limit = 5): KnowledgeEntry[] {
  // Simple search implementation - in a real app, use embeddings and vector search
  const results = knowledgeBase
    .map((entry) => {
      // Calculate a simple relevance score based on word overlap
      const queryWords = query.toLowerCase().split(/\s+/)
      const contentWords = entry.content.toLowerCase().split(/\s+/)

      let matchCount = 0
      queryWords.forEach((word) => {
        if (contentWords.includes(word)) {
          matchCount++
        }
      })

      const score = matchCount / queryWords.length

      return {
        entry,
        score,
      }
    })
    .filter((result) => result.score > 0) // Only include results with some relevance
    .sort((a, b) => b.score - a.score) // Sort by relevance score
    .slice(0, limit) // Take top results
    .map((result) => result.entry)

  return results
}

// Format knowledge entries into a readable response
export function formatEntriesAsResponse(entries: KnowledgeEntry[], query: string): string {
  if (entries.length === 0) {
    return `I couldn't find specific information about "${query}" in the Cyber Essentials guide. Please try rephrasing your question or ask about a different topic related to Cyber Essentials certification.`
  }

  // Group entries by type for better organization
  const sections: KnowledgeEntry[] = []
  const questions: KnowledgeEntry[] = []
  const platforms: KnowledgeEntry[] = []
  const steps: KnowledgeEntry[] = []

  entries.forEach((entry) => {
    switch (entry.metadata.type) {
      case "section":
        sections.push(entry)
        break
      case "question":
        questions.push(entry)
        break
      case "platform":
        platforms.push(entry)
        break
      case "step":
        steps.push(entry)
        break
    }
  })

  let response = `Here's what I found about "${query}" in the Cyber Essentials guide:\n\n`

  // Add section information if available
  if (sections.length > 0) {
    response += "**Relevant Sections:**\n"
    sections.forEach((section) => {
      response += `• ${section.content}\n`
    })
    response += "\n"
  }

  // Add question information if available
  if (questions.length > 0) {
    response += "**Relevant Questions:**\n"
    questions.forEach((question) => {
      response += `• ${question.metadata.title}\n`
      response += `  ${question.content.replace(question.metadata.title || "", "").trim()}\n`
    })
    response += "\n"
  }

  // Add step information if available (usually most specific and helpful)
  if (steps.length > 0) {
    response += "**Specific Steps:**\n"
    steps.forEach((step) => {
      const questionEntry = entries.find(
        (e) => e.metadata.type === "question" && e.metadata.questionId === step.metadata.questionId,
      )
      const platformEntry = entries.find(
        (e) =>
          e.metadata.type === "platform" &&
          e.metadata.questionId === step.metadata.questionId &&
          e.metadata.platformId === step.metadata.platformId,
      )

      const questionContext = questionEntry ? `For "${questionEntry.metadata.title}"` : ""
      const platformContext = platformEntry ? ` (${platformEntry.metadata.title})` : ""

      response += `• ${questionContext}${platformContext}:\n`
      response += `  ${step.metadata.title}: ${step.content.replace(step.metadata.title || "", "").trim()}\n`
    })
    response += "\n"
  }

  // Add platform information if available and no steps were included
  if (platforms.length > 0 && steps.length === 0) {
    response += "**Platforms:**\n"
    platforms.forEach((platform) => {
      response += `• ${platform.content}\n`
    })
    response += "\n"
  }

  // Add navigation help
  const sectionIds = new Set<string>()
  entries.forEach((entry) => {
    if (entry.metadata.sectionId) {
      sectionIds.add(entry.metadata.sectionId)
    }
  })

  if (sectionIds.size > 0) {
    response += "**Where to find this information:**\n"
    Array.from(sectionIds).forEach((sectionId) => {
      const section = sections.find((s) => s.metadata.sectionId === sectionId)
      if (section) {
        response += `• In the "${section.metadata.title}" section of the guide\n`
      }
    })
  }

  return response
}

// Get contextual information based on the current path
export function getContextFromPath(path: string): KnowledgeEntry[] {
  if (typeof window === "undefined") return []

  // Extract section ID from path
  const sectionMatch = path.match(/\/section\/([^/]+)/)
  if (!sectionMatch) return []

  const sectionId = sectionMatch[1]
  const section = sections.find((s) => s.id === sectionId)
  if (!section) return []

  const contextEntries: KnowledgeEntry[] = []

  // Add the current section
  contextEntries.push({
    id: `context-section-${section.id}`,
    content: `${section.title}: ${section.description}`,
    metadata: {
      type: "section",
      sectionId: section.id,
      title: section.title,
    },
  })

  // Add questions from this section
  const questions = getQuestionsBySection(sectionId)
  questions.forEach((question) => {
    contextEntries.push({
      id: `context-question-${question.id}`,
      content: question.title,
      metadata: {
        type: "question",
        sectionId: section.id,
        questionId: question.id,
        title: question.title,
      },
    })
  })

  return contextEntries
}

// Get progress information
export function getProgressContext(): KnowledgeEntry[] {
  if (typeof window === "undefined") return []

  const contextEntries: KnowledgeEntry[] = []

  // Get progress data from localStorage
  const progressData = localStorage.getItem("cyberEssentialsProgress")
  const progress = progressData ? JSON.parse(progressData) : {}

  // Get completed steps data
  const completedStepsData = localStorage.getItem("cyberEssentialsSteps")
  const completedSteps = completedStepsData ? JSON.parse(completedStepsData) : {}

  // Add progress information
  Object.entries(progress).forEach(([sectionId, percentage]) => {
    const section = sections.find((s) => s.id === sectionId)
    if (section) {
      contextEntries.push({
        id: `progress-${sectionId}`,
        content: `Progress in ${section.title}: ${Math.round(percentage as number)}% complete`,
        metadata: {
          type: "section",
          sectionId: section.id,
          title: `Progress in ${section.title}`,
        },
      })
    }
  })

  return contextEntries
}

// Generate a response for common questions that might not be in the knowledge base
export function getCommonResponse(query: string): string | null {
  const lowerQuery = query.toLowerCase()

  // Common questions about Cyber Essentials
  if (
    lowerQuery.includes("what is cyber essentials") ||
    lowerQuery.includes("tell me about cyber essentials") ||
    lowerQuery.includes("explain cyber essentials")
  ) {
    return `Cyber Essentials is a UK government-backed scheme that helps organizations protect against common cyber threats. There are two levels of certification:

1. Cyber Essentials - a self-assessment option
2. Cyber Essentials Plus - includes the same requirements but with additional third-party testing

The scheme focuses on five technical controls:
• Firewalls
• Secure Configuration
• User Access Control
• Malware Protection
• Security Update Management

Certification is valid for 12 months and may include cyber insurance coverage for eligible organizations.`
  }

  // Questions about the five controls
  if (lowerQuery.includes("five controls") || lowerQuery.includes("technical controls")) {
    return `The five technical controls required by Cyber Essentials are:

1. Firewalls: Boundary firewalls and internet gateways must be configured to protect all systems and devices. Software firewalls must be enabled on all devices.

2. Secure Configuration: Organizations must use secure configurations, remove unnecessary functionality, change default passwords, and implement appropriate password policies.

3. User Access Control: Organizations must control user access to data and services, create accounts only when necessary, provide admin privileges only to those who need them, and use separate accounts for administrative tasks.

4. Malware Protection: Organizations must implement anti-malware measures through anti-malware software, application whitelisting, sandboxing, or a combination of these approaches.

5. Security Update Management: Organizations must keep all software up-to-date, apply patches within 14 days for high or critical vulnerabilities, and use supported software with security updates available.`
  }

  // Questions about certification process
  if (
    lowerQuery.includes("certification process") ||
    lowerQuery.includes("get certified") ||
    lowerQuery.includes("how to certify")
  ) {
    return `The Cyber Essentials certification process involves these steps:

1. Organizations complete a self-assessment questionnaire covering the five technical controls
2. For Cyber Essentials, a Certification Body reviews the answers
3. For Cyber Essentials Plus, there's an additional technical audit
4. If successful, certification is valid for 12 months

The self-assessment questionnaire covers your organization's approach to the five technical controls: firewalls, secure configuration, user access control, malware protection, and security update management.`
  }

  // Questions about insurance
  if (lowerQuery.includes("insurance") || lowerQuery.includes("coverage")) {
    return `Cyber Essentials certification includes cyber insurance (up to £25,000) for eligible organizations that meet these criteria:

• Head office domiciled in the UK or Crown Dependencies
• Annual turnover less than £20 million
• Whole organization covered by certification

The insurance typically covers:
• First-party losses from cyber incidents
• Business interruption costs
• Data recovery expenses
• Cyber extortion payments
• Crisis management expenses
• Regulatory defense costs
• Third-party claims

There is no excess/deductible to pay when making a claim. The coverage period is 12 months from the date of certification.`
  }

  // Return null if no common response matches
  return null
}

// Generate suggestions based on the current section
export function getSuggestionsForSection(sectionId: string): string[] {
  switch (sectionId) {
    case "firewalls":
      return [
        "What are the requirements for boundary firewalls?",
        "Do I need software firewalls if I have a hardware firewall?",
        "How do I secure my remote workers' firewalls?",
      ]
    case "secure-configuration":
      return [
        "What password policy meets Cyber Essentials requirements?",
        "How do I remove unnecessary software and services?",
        "What are the requirements for secure configuration?",
      ]
    case "user-access":
      return [
        "How should I manage administrator accounts?",
        "What are the requirements for user access control?",
        "Do I need MFA for Cyber Essentials?",
      ]
    case "malware-protection":
      return [
        "What anti-malware solutions are acceptable?",
        "Do I need anti-malware on all devices?",
        "How should I configure anti-malware scanning?",
      ]
    case "security-updates":
      return [
        "How quickly must security updates be applied?",
        "What if I can't update some software?",
        "How do I manage updates across different devices?",
      ]
    case "scope":
      return [
        "What should be included in my certification scope?",
        "Can I exclude some parts of my organization?",
        "How do I handle cloud services in my scope?",
      ]
    case "insurance":
      return [
        "What insurance comes with Cyber Essentials?",
        "What are the eligibility requirements for insurance?",
        "How do I make a claim on the cyber insurance?",
      ]
    default:
      return [
        "What are the five technical controls?",
        "What's the difference between Cyber Essentials and CE Plus?",
        "How long does certification take?",
      ]
  }
}
