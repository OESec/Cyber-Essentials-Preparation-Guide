/**
 * Client-side audit logging utility
 * Tracks user actions for security and debugging purposes
 * Note: Client-side only - users can clear logs via browser
 */

export interface AuditLogEntry {
  timestamp: string
  action: "upload_spreadsheet" | "paste_questions"
  questionCount: number
  status: "success" | "error"
  errorMessage?: string
  fileSize?: number
  fileName?: string
}

const AUDIT_LOG_KEY = "cyber-essentials-audit-logs"
const MAX_LOG_ENTRIES = 100 // Keep last 100 entries to prevent unbounded growth

/**
 * Log an audit event to localStorage
 */
export function logAuditEvent(event: Omit<AuditLogEntry, "timestamp">): void {
  try {
    const timestamp = new Date().toISOString()
    const entry: AuditLogEntry = {
      timestamp,
      ...event,
    }

    const existingLogs = getAuditLogs()
    const updatedLogs = [entry, ...existingLogs].slice(0, MAX_LOG_ENTRIES)

    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updatedLogs))
  } catch (error) {
    console.error("[Audit Log] Failed to write log entry:", error)
  }
}

/**
 * Retrieve all audit logs from localStorage
 */
export function getAuditLogs(): AuditLogEntry[] {
  try {
    const logsJson = localStorage.getItem(AUDIT_LOG_KEY)
    if (!logsJson) {
      return []
    }
    return JSON.parse(logsJson) as AuditLogEntry[]
  } catch (error) {
    console.error("[Audit Log] Failed to read logs:", error)
    return []
  }
}

/**
 * Clear all audit logs
 */
export function clearAuditLogs(): void {
  try {
    localStorage.removeItem(AUDIT_LOG_KEY)
  } catch (error) {
    console.error("[Audit Log] Failed to clear logs:", error)
  }
}

/**
 * Get audit log statistics
 */
export function getAuditStats(): {
  totalActions: number
  successCount: number
  errorCount: number
  uploadCount: number
  pasteCount: number
  lastAction?: AuditLogEntry
} {
  const logs = getAuditLogs()

  return {
    totalActions: logs.length,
    successCount: logs.filter((log) => log.status === "success").length,
    errorCount: logs.filter((log) => log.status === "error").length,
    uploadCount: logs.filter((log) => log.action === "upload_spreadsheet").length,
    pasteCount: logs.filter((log) => log.action === "paste_questions").length,
    lastAction: logs[0],
  }
}
