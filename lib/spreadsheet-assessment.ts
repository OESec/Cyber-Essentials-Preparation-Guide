// Completely isolated spreadsheet assessment library
// This library handles parsing spreadsheets and generating assessment results

export interface SpreadsheetQuestion {
  questionNo: string
  questionText: string
  answerType: string
  userAnswer: string
}

export interface ColumnDetectionResult {
  questionNoCol: number
  questionTextCol: number
  answerTypeCol: number
  userAnswerCol: number
  headerRowIndex: number
  detectedHeaders: string[]
  answerColumnDetected: boolean
}

export interface AssessmentResult {
  overallScore: number
  sectionResults: SectionResult[]
  flaggedIssues: FlaggedIssue[]
  passedQuestions: PassedQuestion[]
  completeness: number
  summary: string
}

export interface SectionResult {
  sectionId: string
  sectionName: string
  score: number
  answeredQuestions: number
  totalQuestions: number
  issues: string[]
}

export interface FlaggedIssue {
  questionNo: string
  question: string
  issue: string
  severity: 'high' | 'medium' | 'low'
  userAnswer: string
}

export interface PassedQuestion {
  questionNo: string
  question: string
  userAnswer: string
  answerType: string
}

/**
 * Identifies if a row is a question based on multiple criteria
 */
export function isQuestionRow(row: any[]): boolean {
  const firstCell = String(row[0] || '').trim()
  const extractedQuestionNo = extractQuestionNumber(firstCell)
  
  const strictPattern = /^[A-Z]\d+(\.\d+)*$/
  const numericPattern = /^\d+(\.\d+)+$/
  
  if (!strictPattern.test(extractedQuestionNo) && !numericPattern.test(extractedQuestionNo)) {
    return false
  }
  
  const questionText = String(row[1] || '').trim()
  if (!questionText || questionText.length < 10) {
    return false
  }
  
  const isGuidance = questionText.includes('In this section') || 
                     questionText.includes('You should include') ||
                     questionText.includes('For example:') ||
                     questionText.length > 300
  
  return !isGuidance
}

/**
 * Checks if a row is empty or contains only whitespace/formatting
 */
function isEmptyRow(row: any[]): boolean {
  return row.every(cell => {
    const cellStr = String(cell || '').trim()
    return cellStr === '' || cellStr === '\n' || cellStr === '\r\n'
  })
}

/**
 * Checks if a row appears to be a title or header row (not data)
 */
function isTitleRow(row: any[]): boolean {
  const firstCell = String(row[0] || '').trim()
  const restEmpty = row.slice(1).every(cell => String(cell || '').trim() === '')
  
  if (firstCell && firstCell.length > 20 && restEmpty) {
    return true
  }
  
  const titlePatterns = [
    /cyber essentials/i,
    /question set/i,
    /assessment/i,
    /questionnaire/i
  ]
  
  return titlePatterns.some(pattern => firstCell.match(pattern))
}

/**
 * Finds the actual data start row, skipping empty rows, titles, and merged cells
 */
function findDataStartRow(data: any[][]): number {
  for (let i = 0; i < Math.min(50, data.length); i++) {
    const row = data[i]
    
    if (isEmptyRow(row)) {
      continue
    }
    
    if (isTitleRow(row)) {
      continue
    }
    
    const populatedCells = row.filter(cell => String(cell || '').trim() !== '').length
    if (populatedCells >= 3) {
      return i
    }
  }
  
  return 0
}

export function detectAnswerColumn(data: any[][], startRow: number = 0, endRow: number = 50): number {
  const answerColumnNames = [
    'responses',
    'response',
    'my response',
    'user response',
    'my answer', 
    'user answer', 
    'your answer',
    'answer',
    'notes'
  ]
  
  for (let i = startRow; i < Math.min(endRow, data.length); i++) {
    const row = data[i]
    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || '').toLowerCase().trim()
      
      if (cell.includes('type')) {
        continue
      }
      
      for (const columnName of answerColumnNames) {
        if (cell === columnName || cell === columnName + 's' || cell === columnName.slice(0, -1)) {
          return j
        }
      }
      
      for (const columnName of answerColumnNames) {
        if (cell.startsWith(columnName) && !cell.includes('type')) {
          return j
        }
      }
    }
  }
  
  return -1
}

export function getColumnHeaders(data: any[][], headerRowIndex: number = 0): string[] {
  if (data.length === 0 || headerRowIndex >= data.length) {
    return []
  }
  
  const headers: string[] = []
  const row = data[headerRowIndex]
  
  for (let i = 0; i < row.length; i++) {
    const cell = String(row[i] || '').trim()
    if (cell) {
      headers.push(cell)
    } else {
      headers.push(getColumnLetter(i))
    }
  }
  
  return headers
}

function getColumnLetter(index: number): string {
  let letter = ''
  let num = index
  
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter
    num = Math.floor(num / 26) - 1
  }
  
  return letter
}

/**
 * Detects column positions in the spreadsheet
 */
export function detectColumns(data: any[][]): ColumnDetectionResult {
  const dataStartRow = findDataStartRow(data)
  
  let headerRowIndex = -1
  let questionNoCol = -1
  let questionTextCol = -1
  let answerTypeCol = -1
  let userAnswerCol = -1
  let detectedHeaders: string[] = []
  
  for (let i = dataStartRow; i < Math.min(dataStartRow + 50, data.length); i++) {
    const row = data[i]
    
    if (isEmptyRow(row)) {
      continue
    }
    
    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || '').toLowerCase().trim()
      
      if ((cell.includes('no.') || cell === 'no' || cell.includes('q.no') || 
           cell.includes('question no') || cell.includes('q no')) && questionNoCol === -1) {
        questionNoCol = j
      }
      
      if (cell.includes('question') && !cell.includes('no') && 
          !cell.includes('type') && questionTextCol === -1) {
        questionTextCol = j
      }
      
      if ((cell.includes('answer type') || cell.includes('response type') || 
           (cell === 'type' && answerTypeCol === -1))) {
        answerTypeCol = j
      }
    }
    
    if (questionNoCol >= 0 && questionTextCol >= 0) {
      headerRowIndex = i
      detectedHeaders = getColumnHeaders(data, i)
      break
    }
  }
  
  if (headerRowIndex >= 0) {
    userAnswerCol = detectAnswerColumn(data, headerRowIndex, headerRowIndex + 1)
  } else {
    userAnswerCol = detectAnswerColumn(data, dataStartRow, dataStartRow + 50)
  }
  
  if (headerRowIndex === -1) {
    const questionPattern = /[A-Z]\d+(?:\.\d+)*/
    
    for (let j = 0; j < Math.min(15, data[dataStartRow]?.length || 0); j++) {
      let patternMatches = 0
      for (let i = dataStartRow; i < Math.min(dataStartRow + 50, data.length); i++) {
        const cell = String(data[i][j] || '').trim()
        if (questionPattern.test(cell) || extractQuestionNumber(cell).match(questionPattern)) {
          patternMatches++
        }
      }
      
      if (patternMatches >= 5) {
        questionNoCol = j
        questionTextCol = j + 1
        answerTypeCol = j + 2
        headerRowIndex = dataStartRow
        detectedHeaders = getColumnHeaders(data, dataStartRow)
        break
      }
    }
  }
  
  if (headerRowIndex === -1) {
    questionNoCol = 0
    questionTextCol = 1
    answerTypeCol = 2
    headerRowIndex = dataStartRow
    detectedHeaders = getColumnHeaders(data, dataStartRow)
  }
  
  return {
    questionNoCol,
    questionTextCol,
    answerTypeCol,
    userAnswerCol,
    headerRowIndex,
    detectedHeaders,
    answerColumnDetected: userAnswerCol >= 0
  }
}

export function parseSpreadsheet(data: any[][], userAnswerColOverride?: number): SpreadsheetQuestion[] {
  const questions: SpreadsheetQuestion[] = []
  
  const columnInfo = detectColumns(data)
  
  let { questionNoCol, questionTextCol, answerTypeCol, userAnswerCol, headerRowIndex } = columnInfo
  
  if (userAnswerColOverride !== undefined && userAnswerColOverride >= 0) {
    userAnswerCol = userAnswerColOverride
  }
  
  if (userAnswerCol === -1) {
    userAnswerCol = answerTypeCol + 1
  }
  
  const tryParse = (qNoCol: number, qTextCol: number, aTypeCol: number, uAnswerCol: number, startRow: number): SpreadsheetQuestion[] => {
    const parsed: SpreadsheetQuestion[] = []
    
    for (let i = startRow + 1; i < data.length; i++) {
      const row = data[i]
      
      const mappedRow = [
        row[qNoCol],
        row[qTextCol],
        row[aTypeCol],
        row[uAnswerCol]
      ]
      
      if (isQuestionRow(mappedRow)) {
        const rawQuestionNo = String(row[qNoCol] || '').trim()
        const questionNo = extractQuestionNumber(rawQuestionNo)
        const questionText = String(row[qTextCol] || '').trim()
        const answerType = String(row[aTypeCol] || 'Notes').trim()
        const userAnswer = String(row[uAnswerCol] || '').trim()
        
        parsed.push({
          questionNo,
          questionText,
          answerType,
          userAnswer
        })
      }
    }
    
    return parsed
  }
  
  let parsedQuestions = tryParse(questionNoCol, questionTextCol, answerTypeCol, userAnswerCol, headerRowIndex)
  
  if (parsedQuestions.length === 0 && questionNoCol !== 2) {
    parsedQuestions = tryParse(2, 3, 4, 5, 0)
  }
  
  return parsedQuestions
}

/**
 * Parses pasted text into questions - supports multiple formats
 * Formats supported:
 * - Tab-separated (from Excel/Google Sheets copy-paste)
 * - Pipe-separated: A1.1 | Question text | Answer type | User answer
 * - Simple: A1.1: Question? Answer: text
 * - Multi-line: Question on one line, "Answer:" on next line
 */
export function parseTextQuestions(text: string): SpreadsheetQuestion[] {
  const questions: SpreadsheetQuestion[] = []
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    let questionNo = ''
    let questionText = ''
    let answerType = 'Notes'
    let userAnswer = ''

    // Try tab-separated format (Excel/Google Sheets copy-paste)
    if (line.includes('\t')) {
      const parts = line.split('\t').map(p => p.trim())
      
      if (parts.length >= 2) {
        questionNo = extractQuestionNumber(parts[0])
        questionText = parts[1] || ''
        answerType = parts[2] || 'Notes'
        userAnswer = parts[3] || ''
      }
    }
    // Try pipe-separated format
    else if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim())
      
      if (parts.length >= 2) {
        questionNo = extractQuestionNumber(parts[0])
        questionText = parts[1] || ''
        answerType = parts[2] || 'Notes'
        userAnswer = parts[3] || ''
      }
    }
    // Try simple format: "A1.1: Question? Answer: text" (single line)
    else if (line.includes(':')) {
      // First try to extract question number and text
      const questionMatch = line.match(/^([A-Z]?\d+(?:\.\d+)*)[:\s]+(.+)$/i)
      
      if (questionMatch) {
        const extractedNo = questionMatch[1].trim()
        questionNo = extractedNo.match(/^[A-Z]/) ? extractedNo : extractedNo
        const remaining = questionMatch[2].trim()
        
        // Check if answer is on the same line
        const answerSplit = remaining.match(/^(.+?)(?:\s+Answer:\s+|\s+Response:\s+)(.+)$/i)
        if (answerSplit) {
          questionText = answerSplit[1].trim()
          userAnswer = answerSplit[2].trim()
        } else {
          questionText = remaining
          
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1]
            const answerMatch = nextLine.match(/^(?:Answer:|Response:)\s*(.+)$/i)
            if (answerMatch) {
              userAnswer = answerMatch[1].trim()
              i++ // Skip the next line since we've consumed it
            }
          }
        }
      }
    }
    // Try format without colon: "A1.8 Question text here"
    else {
      const questionMatch = line.match(/^([A-Z]?\d+(?:\.\d+)*)\s+(.+)$/i)
      
      if (questionMatch) {
        const extractedNo = questionMatch[1].trim()
        questionNo = extractedNo.match(/^[A-Z]/) ? extractedNo : extractedNo
        questionText = questionMatch[2].trim()
        
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1]
          const answerMatch = nextLine.match(/^(?:Answer:|Response:)\s*(.+)$/i)
          if (answerMatch) {
            userAnswer = answerMatch[1].trim()
            i++ // Skip the next line since we've consumed it
          }
        }
      }
    }

    // Validate and add if we have at least question number and text
    if (questionNo && questionText && questionText.length >= 10) {
      const strictPattern = /^[A-Z]\d+(\.\d+)*$/
      const numericPattern = /^\d+(\.\d+)+$/
      
      if (strictPattern.test(questionNo) || numericPattern.test(questionNo)) {
        questions.push({
          questionNo,
          questionText,
          answerType,
          userAnswer
        })
      }
    }

    i++
  }

  return questions
}

/**
 * Maps question numbers to section IDs based on Cyber Essentials structure
 */
export function getSectionIdFromQuestionNo(questionNo: string): string {
  const prefix = questionNo.split('.')[0]
  
  const sectionMap: Record<string, string> = {
    'A1': 'company-info',
    'A2': 'scope',
    'A3': 'insurance',
    'A4': 'firewalls',
    'A5': 'secure-configuration',
    'A6': 'security-updates',
    'A7': 'access-control',
    'A8': 'malware-protection'
  }
  
  return sectionMap[prefix] || 'unknown'
}

/**
 * Gets section name from section ID
 */
export function getSectionName(sectionId: string): string {
  const sectionNames: Record<string, string> = {
    'company-info': 'Your Company',
    'scope': 'Scope of Assessment',
    'insurance': 'Insurance',
    'firewalls': 'Firewalls',
    'secure-configuration': 'Secure Configuration',
    'security-updates': 'Security Update Management',
    'access-control': 'User Access Control',
    'malware-protection': 'Malware Protection'
  }
  
  return sectionNames[sectionId] || 'Unknown Section'
}

/**
 * Assesses a question and returns issues
 */
export function assessQuestion(question: SpreadsheetQuestion): FlaggedIssue | null {
  const { questionNo, questionText, answerType, userAnswer } = question
  
  if (!userAnswer || userAnswer.length < 2) {
    return {
      questionNo,
      question: questionText,
      issue: 'Answer is missing or incomplete',
      severity: 'high',
      userAnswer: userAnswer || ''
    }
  }
  
  if (answerType.toLowerCase().includes('yes')) {
    const normalizedAnswer = userAnswer.toLowerCase()
    if (!normalizedAnswer.includes('yes') && !normalizedAnswer.includes('no')) {
      return {
        questionNo,
        question: questionText,
        issue: 'Answer must be Yes or No',
        severity: 'medium',
        userAnswer
      }
    }
    
    if (normalizedAnswer.includes('no')) {
      if (questionText.includes('firewall') || 
          questionText.includes('anti-malware') ||
          questionText.includes('security updates')) {
        return {
          questionNo,
          question: questionText,
          issue: 'This "No" answer may indicate non-compliance',
          severity: 'high',
          userAnswer
        }
      }
    }
  }
  
  if (answerType.toLowerCase().includes('notes') && userAnswer.length < 10) {
    return {
      questionNo,
      question: questionText,
      issue: 'Answer is too brief, more detail required',
      severity: 'medium',
      userAnswer
    }
  }
  
  return null
}

/**
 * Generates assessment results from parsed questions
 */
export function generateAssessment(questions: SpreadsheetQuestion[]): AssessmentResult {
  const sectionResults: Map<string, SectionResult> = new Map()
  const flaggedIssues: FlaggedIssue[] = []
  const passedQuestions: PassedQuestion[] = []
  
  for (const question of questions) {
    const sectionId = getSectionIdFromQuestionNo(question.questionNo)
    
    if (!sectionResults.has(sectionId)) {
      sectionResults.set(sectionId, {
        sectionId,
        sectionName: getSectionName(sectionId),
        score: 0,
        answeredQuestions: 0,
        totalQuestions: 0,
        issues: []
      })
    }
    
    const section = sectionResults.get(sectionId)!
    section.totalQuestions++
    
    const issue = assessQuestion(question)
    if (issue) {
      flaggedIssues.push(issue)
      section.issues.push(`${issue.questionNo}: ${issue.issue}`)
    } else {
      passedQuestions.push({
        questionNo: question.questionNo,
        question: question.questionText,
        userAnswer: question.userAnswer,
        answerType: question.answerType
      })
      section.answeredQuestions++
    }
    
    section.score = section.totalQuestions > 0 
      ? (section.answeredQuestions / section.totalQuestions) * 100 
      : 0
  }
  
  const sections = Array.from(sectionResults.values())
  const totalQuestions = questions.length
  const answeredQuestions = questions.filter(q => q.userAnswer && q.userAnswer.length >= 2).length
  const overallScore = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
  const completeness = overallScore
  
  const highIssues = flaggedIssues.filter(i => i.severity === 'high').length
  const mediumIssues = flaggedIssues.filter(i => i.severity === 'medium').length
  
  let summary = ''
  if (overallScore >= 90) {
    summary = 'Excellent! Your assessment is nearly complete with minimal issues.'
  } else if (overallScore >= 70) {
    summary = 'Good progress! You have answered most questions, but some areas need attention.'
  } else if (overallScore >= 50) {
    summary = 'Fair progress. Several questions still need to be answered or improved.'
  } else {
    summary = 'Your assessment needs significant work. Many questions are incomplete or missing.'
  }
  
  if (highIssues > 0) {
    summary += ` You have ${highIssues} high-severity issue${highIssues > 1 ? 's' : ''} that require immediate attention.`
  }
  if (mediumIssues > 0) {
    summary += ` There are ${mediumIssues} medium-severity issue${mediumIssues > 1 ? 's' : ''} to address.`
  }
  
  return {
    overallScore,
    sectionResults: sections,
    flaggedIssues,
    passedQuestions,
    completeness,
    summary
  }
}

/**
 * Stores assessment result in localStorage (isolated storage)
 */
export function saveAssessmentResult(result: AssessmentResult): void {
  try {
    localStorage.setItem('spreadsheet_assessment_result', JSON.stringify(result))
    localStorage.setItem('spreadsheet_assessment_timestamp', new Date().toISOString())
  } catch (error) {
    console.error('Failed to save assessment result:', error)
  }
}

/**
 * Retrieves stored assessment result
 */
export function getStoredAssessmentResult(): { result: AssessmentResult; timestamp: string } | null {
  try {
    const resultStr = localStorage.getItem('spreadsheet_assessment_result')
    const timestamp = localStorage.getItem('spreadsheet_assessment_timestamp')
    
    if (resultStr && timestamp) {
      return {
        result: JSON.parse(resultStr),
        timestamp
      }
    }
  } catch (error) {
    console.error('Failed to retrieve assessment result:', error)
  }
  
  return null
}

/**
 * Clears stored assessment result
 */
export function clearAssessmentResult(): void {
  try {
    localStorage.removeItem('spreadsheet_assessment_result')
    localStorage.removeItem('spreadsheet_assessment_timestamp')
  } catch (error) {
    console.error('Failed to clear assessment result:', error)
  }
}

/**
 * Extracts question number from text that may contain extra formatting
 * Examples: "Question A1.1" → "A1.1", " A2.5 " → "A2.5", "1.1" → "1.1"
 */
function extractQuestionNumber(text: string): string {
  const cleaned = String(text || '').trim()
  
  const match = cleaned.match(/[A-Z]\d+(?:\.\d+)*/)
  if (match) {
    return match[0]
  }
  
  return cleaned
}
