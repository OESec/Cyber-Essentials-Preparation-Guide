"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { parseTextQuestions, generateAssessment } from "@/lib/spreadsheet-assessment"
import { AssessmentResultsDisplay } from "./assessment-results-display"
import { sanitizeTextInput } from "@/lib/sanitize"
import { logAuditEvent } from "@/lib/audit-log"

const MAX_QUESTIONS = 500

export function PasteQuestionsForm() {
  const [pastedText, setPastedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const { toast } = useToast()

  const handleProcess = () => {
    if (!pastedText.trim()) {
      toast({
        title: "No input",
        description: "Please paste your questions first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      console.log("[v0] Sanitizing pasted text input...")
      const sanitizedText = sanitizeTextInput(pastedText, 100000)
      console.log("[v0] Text sanitized, parsing questions...")

      const questions = parseTextQuestions(sanitizedText)

      if (questions.length === 0) {
        logAuditEvent({
          action: "paste_questions",
          questionCount: 0,
          status: "error",
          errorMessage: "No questions found in pasted text",
        })

        toast({
          title: "No questions found",
          description: "Could not parse any valid questions. Please check the format and try again.",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      if (questions.length > MAX_QUESTIONS) {
        logAuditEvent({
          action: "paste_questions",
          questionCount: questions.length,
          status: "error",
          errorMessage: `Exceeded maximum question limit (${MAX_QUESTIONS})`,
        })

        toast({
          title: "Too many questions",
          description: `Found ${questions.length} questions. Maximum allowed is ${MAX_QUESTIONS}. Please split into smaller batches.`,
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      console.log("[v0] Parsed questions, generating assessment...")
      const result = generateAssessment(questions)
      setAssessmentResult(result)

      logAuditEvent({
        action: "paste_questions",
        questionCount: questions.length,
        status: "success",
      })

      toast({
        title: "Assessment Complete",
        description: `Processed ${questions.length} question${questions.length > 1 ? "s" : ""}`,
      })
      console.log("[v0] Assessment complete")
    } catch (error) {
      console.error("Error processing questions:", error)

      logAuditEvent({
        action: "paste_questions",
        questionCount: 0,
        status: "error",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })

      toast({
        title: "Processing Error",
        description: "An error occurred while processing your questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setPastedText("")
    setAssessmentResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Paste Your Questions</label>
            <Textarea
              placeholder="Paste questions here... 

Supported formats:
• Tab-separated (copy directly from Excel/Google Sheets)
• Pipe-separated: A1.1 | What is your organisation's name? | Notes | Acme Corp
• Simple format: A1.1: Question text? Answer: My answer

Example:
A1.1	What is your organisation's name?	Notes	Acme Corporation
A1.2	What type of organisation are you?	Multiple choice	Limited Company"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="min-h-[300px] font-mono text-sm text-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleProcess} disabled={isProcessing || !pastedText.trim()}>
              {isProcessing ? "Processing..." : "Process Questions"}
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={isProcessing}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {assessmentResult && <AssessmentResultsDisplay result={assessmentResult} source="paste" />}
    </div>
  )
}
