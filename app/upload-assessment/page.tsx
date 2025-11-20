"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UploadAssessmentForm } from "@/components/upload-assessment-form"
import { PasteQuestionsForm } from "@/components/paste-questions-form"

export default function UploadAssessmentPage() {
  const [mode, setMode] = useState<"upload" | "paste">("upload")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-1 mb-4 bg-transparent">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Spreadsheet Assessment Tool</h1>
        <p className="text-gray-600">
          Upload your completed Cyber Essentials questionnaire spreadsheet or paste individual questions to receive an
          automated assessment.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b">
        <Button
          variant={mode === "upload" ? "default" : "ghost"}
          onClick={() => setMode("upload")}
          className="rounded-b-none"
        >
          Upload Spreadsheet
        </Button>
        <Button
          variant={mode === "paste" ? "default" : "ghost"}
          onClick={() => setMode("paste")}
          className="rounded-b-none"
        >
          Paste Questions
        </Button>
      </div>

      {mode === "upload" ? (
        <>
          <UploadAssessmentForm />

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold mb-3 text-gray-900">How it works</h2>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">1.</span>
                  <span>
                    Upload your completed Cyber Essentials questionnaire spreadsheet (XLSX, XLS, or CSV format)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">2.</span>
                  <span>Our system automatically parses the questions and your answers, ignoring guidance text</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">3.</span>
                  <span>Receive an instant assessment with completion scores, flagged issues, and recommendations</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">4.</span>
                  <span>Review section-by-section breakdowns to understand where to focus your efforts</span>
                </li>
              </ol>
            </div>
          </div>
        </>
      ) : (
        <>
          <PasteQuestionsForm />

          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold mb-3 text-gray-900">How to use</h2>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">1.</span>
                  <span>
                    Paste one or more questions from your spreadsheet (copy directly from Excel or Google Sheets)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">2.</span>
                  <span>The system automatically detects tab-separated or pipe-separated formats</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">3.</span>
                  <span>Click "Process Questions" to receive instant feedback on your answers</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-medium text-blue-600">4.</span>
                  <span>Review results and identify areas that need improvement</span>
                </li>
              </ol>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
