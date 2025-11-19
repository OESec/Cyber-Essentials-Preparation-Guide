// Completely isolated spreadsheet assessment library
// This library handles parsing spreadsheets and generating assessment results

export interface SpreadsheetQuestion {
  questionNo: string
  questionText: string
  answerType: string
  userAnswer: string
}

export interface AssessmentResult {
  overallScore: number
  sectionResults: SectionResult[]
  flaggedIssues: FlaggedIssue[]
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
}

/**
 * Identifies if a row is a question based on multiple criteria
 */
export function isQuestionRow(row: any[]): boolean {
  // Check if first cell contains a question number pattern (e.g., A1.1, A2.5)
  const firstCell = String(row[0] || '').trim()
  const questionNoPattern = /^[A-Z]\d+(\.\d+)*$/
  
  if (!questionNoPattern.test(firstCell)) {
    return false
  }
  
  // Check if there's question text
  const questionText = String(row[1] || '').trim()
  if (!questionText || questionText.length < 10) {
    return false
  }
  
  // Check if it's NOT guidance text (guidance usually doesn't have question marks or is very long)
  const isGuidance = questionText.includes('In this section') || 
                     questionText.includes('You should include') ||
                     questionText.includes('For example:') ||
                     questionText.length > 300
  
  return !isGuidance
}

/**
 * Parses a spreadsheet and extracts questions with user answers
 */
export function parseSpreadsheet(data: any[][]): SpreadsheetQuestion[] {
  const questions: SpreadsheetQuestion[] = []
  
  // Find header row to determine column positions
  let headerRowIndex = -1
  let questionNoCol = -1
  let questionTextCol = -1
  let answerTypeCol = -1
  let userAnswerCol = -1
  
  for (let i = 0; i < Math.min(20, data.length); i++) {
    const row = data[i]
    for (let j = 0; j < row.length; j++) {
      const cell = String(row[j] || '').toLowerCase().trim()
      if (cell.includes('no.') || cell === 'no') questionNoCol = j
      if (cell.includes('question')) questionTextCol = j
      if (cell.includes('answer type') || cell.includes('type')) answerTypeCol = j
      if (cell.includes('notes') || cell.includes('your answer')) userAnswerCol = j
    }
    
    if (questionNoCol >= 0 && questionTextCol >= 0) {
      headerRowIndex = i
      break
    }
  }
  
  // If we can't find headers, try default positions
  if (headerRowIndex === -1) {
    questionNoCol = 2 // Column C
    questionTextCol = 3 // Column D
    answerTypeCol = 4 // Column E (not always present)
    userAnswerCol = 5 // Column F or G
    headerRowIndex = 0
  }
  
  // Parse questions
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i]
    
    if (isQuestionRow(row)) {
      const questionNo = String(row[questionNoCol] || '').trim()
      const questionText = String(row[questionTextCol] || '').trim()
      const answerType = String(row[answerTypeCol] || 'Notes').trim()
      const userAnswer = String(row[userAnswerCol] || '').trim()
      
      questions.push({
        questionNo,
        questionText,
        answerType,
        userAnswer
      })
    }
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
  
  // Check if answer is missing
  if (!userAnswer || userAnswer.length < 2) {
    return {
      questionNo,
      question: questionText,
      issue: 'Answer is missing or incomplete',
      severity: 'high'
    }
  }
  
  // Check Yes/No questions
  if (answerType.toLowerCase().includes('yes')) {
    const normalizedAnswer = userAnswer.toLowerCase()
    if (!normalizedAnswer.includes('yes') && !normalizedAnswer.includes('no')) {
      return {
        questionNo,
        question: questionText,
        issue: 'Answer must be Yes or No',
        severity: 'medium'
      }
    }
    
    // Flag certain "No" answers as potential issues
    if (normalizedAnswer.includes('no')) {
      // Questions where "No" might indicate non-compliance
      if (questionText.includes('firewall') || 
          questionText.includes('anti-malware') ||
          questionText.includes('security updates')) {
        return {
          questionNo,
          question: questionText,
          issue: 'This "No" answer may indicate non-compliance',
          severity: 'high'
        }
      }
    }
  }
  
  // Check for very short answers on open questions
  if (answerType.toLowerCase().includes('notes') && userAnswer.length < 10) {
    return {
      questionNo,
      question: questionText,
      issue: 'Answer is too brief, more detail required',
      severity: 'medium'
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
  
  // Group questions by section
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
    
    // Assess the question
    const issue = assessQuestion(question)
    if (issue) {
      flaggedIssues.push(issue)
      section.issues.push(`${issue.questionNo}: ${issue.issue}`)
    } else {
      section.answeredQuestions++
    }
    
    // Calculate section score
    section.score = section.totalQuestions > 0 
      ? (section.answeredQuestions / section.totalQuestions) * 100 
      : 0
  }
  
  // Calculate overall metrics
  const sections = Array.from(sectionResults.values())
  const totalQuestions = questions.length
  const answeredQuestions = questions.filter(q => q.userAnswer && q.userAnswer.length >= 2).length
  const overallScore = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
  const completeness = overallScore
  
  // Generate summary
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
    console.error('[v0] Failed to save assessment result:', error)
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
    console.error('[v0] Failed to retrieve assessment result:', error)
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
    console.error('[v0] Failed to clear assessment result:', error)
  }
}
