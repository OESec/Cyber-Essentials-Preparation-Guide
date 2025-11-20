/**
 * Input Sanitization Library
 * Sanitizes user input to prevent XSS and injection attacks
 * Uses native JavaScript - no external dependencies
 */

/**
 * Sanitizes a string by removing/escaping potentially dangerous content
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "")

  // Escape special HTML characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")

  // Remove null bytes and other control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")

  // Remove any javascript: or data: protocol attempts
  sanitized = sanitized.replace(/javascript:/gi, "")
  sanitized = sanitized.replace(/data:/gi, "")
  sanitized = sanitized.replace(/vbscript:/gi, "")

  // Trim excessive whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Sanitizes an object's string properties recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      if (typeof value === "string") {
        sanitized[key] = sanitizeString(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) => (typeof item === "string" ? sanitizeString(item) : item))
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
  }

  return sanitized as T
}

/**
 * Validates and sanitizes question number format
 * Ensures only valid patterns are allowed (A1.1, A2.5, etc.)
 */
export function sanitizeQuestionNumber(questionNo: string): string {
  if (!questionNo || typeof questionNo !== "string") {
    return ""
  }

  // Remove any HTML/script tags first
  let sanitized = questionNo.replace(/<[^>]*>/g, "").trim()

  // Only allow alphanumeric, dots, and basic punctuation
  sanitized = sanitized.replace(/[^A-Za-z0-9.\-_]/g, "")

  // Validate against expected patterns
  const validPattern = /^[A-Z]?\d+(?:\.\d+)*$/
  if (!validPattern.test(sanitized)) {
    // If it doesn't match, try to extract the valid part
    const match = sanitized.match(/([A-Z]?\d+(?:\.\d+)*)/)
    return match ? match[1] : ""
  }

  return sanitized
}

/**
 * Enforces maximum length limits on input strings
 */
export function enforceMaxLength(input: string, maxLength: number): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  if (input.length > maxLength) {
    return input.substring(0, maxLength)
  }

  return input
}

/**
 * Sanitizes an entire text input (for paste functionality)
 * Applies line-by-line sanitization and length limits
 */
export function sanitizeTextInput(text: string, maxTotalLength = 100000): string {
  if (!text || typeof text !== "string") {
    return ""
  }

  // Enforce total length limit
  let sanitized = enforceMaxLength(text, maxTotalLength)

  // Remove any script tags entirely
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove any iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")

  return sanitized
}

/**
 * Sanitizes array of spreadsheet data
 */
export function sanitizeSpreadsheetData(data: any[][]): any[][] {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((row) => {
    if (!Array.isArray(row)) {
      return []
    }

    return row.map((cell) => {
      if (typeof cell === "string") {
        return sanitizeString(cell)
      }
      return cell
    })
  })
}
