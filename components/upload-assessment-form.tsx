"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  parseSpreadsheet,
  generateAssessment,
  saveAssessmentResult,
  detectColumns,
  type ColumnDetectionResult,
} from "@/lib/spreadsheet-assessment"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sanitizeSpreadsheetData } from "@/lib/sanitize"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function UploadAssessmentForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [spreadsheetData, setSpreadsheetData] = useState<any[][] | null>(null)
  const [columnInfo, setColumnInfo] = useState<ColumnDetectionResult | null>(null)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [selectedAnswerColumn, setSelectedAnswerColumn] = useState<string>("")
  const { toast } = useToast()
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
      toast({
        title: "File too large",
        description: `File size is ${fileSizeMB}MB. Maximum allowed size is ${maxSizeMB}MB.`,
        variant: "destructive",
      })
      return
    }

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ]

    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls") &&
      !selectedFile.name.endsWith(".csv")
    ) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .xlsx, .xls, or .csv file",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setSpreadsheetData(null)
    setColumnInfo(null)
    setShowColumnSelector(false)
    setSelectedAnswerColumn("")

    toast({
      title: "File selected",
      description: `${selectedFile.name} is ready to process`,
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const processSpreadsheet = async () => {
    if (!file) return

    setIsProcessing(true)

    try {
      console.log("[v0] Reading spreadsheet file...")
      const arrayBuffer = await file.arrayBuffer()
      const XLSX = await import("xlsx")
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" })

      console.log("[v0] Sanitizing spreadsheet data...")
      const sanitizedData = sanitizeSpreadsheetData(data as any[][])
      console.log("[v0] Data sanitized, detecting columns...")

      const detectedColumns = detectColumns(sanitizedData)
      setSpreadsheetData(sanitizedData)
      setColumnInfo(detectedColumns)

      if (!detectedColumns.answerColumnDetected) {
        setShowColumnSelector(true)
        setIsProcessing(false)

        toast({
          title: "Answer column not found",
          description: "Please select which column contains your answers",
          variant: "default",
        })
        return
      }

      await completeProcessing(sanitizedData)
    } catch (error) {
      console.error("[v0] Error processing spreadsheet:", error)
      toast({
        title: "Processing error",
        description: "Failed to process the spreadsheet. Please ensure it's in the correct format.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const completeProcessing = async (data: any[][], userAnswerColIndex?: number) => {
    setIsProcessing(true)

    try {
      console.log("[v0] Parsing spreadsheet questions...")
      const questions = parseSpreadsheet(data, userAnswerColIndex)

      if (questions.length === 0) {
        toast({
          title: "No questions found",
          description: `Checked ${data.length} rows. Ensure question numbers follow format like A1.1, A2.5, etc.`,
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      console.log("[v0] Generating assessment from questions...")
      const assessment = generateAssessment(questions)
      saveAssessmentResult(assessment)

      toast({
        title: "Assessment complete!",
        description: `Processed ${questions.length} questions from your spreadsheet`,
      })

      console.log("[v0] Assessment saved, redirecting to results...")
      router.push("/upload-assessment/results")
    } catch (error) {
      console.error("[v0] Error completing assessment:", error)
      toast({
        title: "Processing error",
        description: "Failed to complete the assessment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleColumnSelection = async () => {
    if (!spreadsheetData || !selectedAnswerColumn || !columnInfo) {
      return
    }

    const columnIndex = columnInfo.detectedHeaders.indexOf(selectedAnswerColumn)

    if (columnIndex === -1) {
      toast({
        title: "Invalid selection",
        description: "Please select a valid column",
        variant: "destructive",
      })
      return
    }

    setShowColumnSelector(false)
    await completeProcessing(spreadsheetData, columnIndex)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Completed Assessment</CardTitle>
        <CardDescription>
          Upload your completed Cyber Essentials questionnaire spreadsheet for automatic assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={
            dragActive
              ? "border-2 border-dashed rounded-lg p-12 text-center transition-colors border-blue-500 bg-blue-50"
              : "border-2 border-dashed rounded-lg p-12 text-center transition-colors border-gray-300"
          }
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              {file ? (
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              ) : (
                <Upload className="h-8 w-8 text-blue-600" />
              )}
            </div>

            {file ? (
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drag and drop your spreadsheet here</p>
                <p className="text-sm text-gray-600">or click the button below to browse</p>
              </div>
            )}

            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                <span>{file ? "Choose Different File" : "Choose File"}</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
            />
          </div>
        </div>

        {showColumnSelector && columnInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm flex-1">
                <p className="font-medium text-amber-900 mb-2">Which column contains your answers?</p>
                <p className="text-amber-800 mb-3">
                  We couldn't automatically find your answer column. Please select it from the list below:
                </p>
                <Select value={selectedAnswerColumn} onValueChange={setSelectedAnswerColumn}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select answer column..." />
                  </SelectTrigger>
                  <SelectContent>
                    {columnInfo.detectedHeaders.map((header, index) => (
                      <SelectItem key={index} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleColumnSelection}
                  disabled={!selectedAnswerColumn || isProcessing}
                  className="w-full mt-3"
                >
                  {isProcessing ? "Processing..." : "Continue with Selected Column"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Supported formats</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• CSV files (.csv)</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Must contain question numbers (e.g., A1.1, A2.5)</li>
                <li>• Must have your answers filled in</li>
                <li>• Tip: Name your answer column "Answer", "My Answer", or "Response" for automatic detection</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          onClick={processSpreadsheet}
          disabled={!file || isProcessing || showColumnSelector}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Process Assessment"}
        </Button>
      </CardContent>
    </Card>
  )
}
