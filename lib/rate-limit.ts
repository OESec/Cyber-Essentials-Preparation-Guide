/**
 * Client-side rate limiting utilities
 * Provides debouncing, cooldown timers, and submission tracking
 */

const RATE_LIMIT_KEY = "assessment_rate_limit"
const COOLDOWN_SECONDS = 10 // Wait 10 seconds between submissions
const MAX_SUBMISSIONS_PER_HOUR = 20 // Maximum 20 assessments per hour

interface RateLimitData {
  lastSubmission: number
  submissions: number[]
}

/**
 * Get rate limit data from localStorage
 */
function getRateLimitData(): RateLimitData {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY)
    if (!data) {
      return { lastSubmission: 0, submissions: [] }
    }
    return JSON.parse(data)
  } catch {
    return { lastSubmission: 0, submissions: [] }
  }
}

/**
 * Save rate limit data to localStorage
 */
function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Clean up old submission timestamps (older than 1 hour)
 */
function cleanOldSubmissions(submissions: number[]): number[] {
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  return submissions.filter((timestamp) => timestamp > oneHourAgo)
}

/**
 * Check if rate limit is exceeded
 * Returns object with exceeded flag and details
 */
export function checkRateLimit(): {
  exceeded: boolean
  reason?: string
  remainingSeconds?: number
  submissionsInLastHour?: number
} {
  const data = getRateLimitData()
  const now = Date.now()

  // Check cooldown timer
  const timeSinceLastSubmission = now - data.lastSubmission
  const cooldownMs = COOLDOWN_SECONDS * 1000

  if (timeSinceLastSubmission < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSubmission) / 1000)
    return {
      exceeded: true,
      reason: `Please wait ${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""} before submitting again`,
      remainingSeconds,
    }
  }

  // Check hourly submission limit
  const cleanedSubmissions = cleanOldSubmissions(data.submissions)
  if (cleanedSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    return {
      exceeded: true,
      reason: `You've reached the maximum of ${MAX_SUBMISSIONS_PER_HOUR} assessments per hour. Please try again later.`,
      submissionsInLastHour: cleanedSubmissions.length,
    }
  }

  return {
    exceeded: false,
    submissionsInLastHour: cleanedSubmissions.length,
  }
}

/**
 * Record a submission
 */
export function recordSubmission(): void {
  const data = getRateLimitData()
  const now = Date.now()

  const cleanedSubmissions = cleanOldSubmissions(data.submissions)
  cleanedSubmissions.push(now)

  saveRateLimitData({
    lastSubmission: now,
    submissions: cleanedSubmissions,
  })
}

/**
 * Get remaining cooldown time in seconds
 */
export function getRemainingCooldown(): number {
  const data = getRateLimitData()
  const now = Date.now()
  const timeSinceLastSubmission = now - data.lastSubmission
  const cooldownMs = COOLDOWN_SECONDS * 1000

  if (timeSinceLastSubmission < cooldownMs) {
    return Math.ceil((cooldownMs - timeSinceLastSubmission) / 1000)
  }

  return 0
}

/**
 * Debounce function - delays execution until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
