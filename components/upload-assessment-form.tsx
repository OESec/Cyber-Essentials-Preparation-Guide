"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { parseSpreadsheet, generateAssessment, saveAssessmentResult } from "@/lib/spreadsheet-assessment"
import { useRouter } from 'next/navigation'

export function UploadAssessmentForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
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
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ]

    if (!validTypes.includes(selectedFile.type) && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls') && 
        !selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .xlsx, .xls, or .csv file",
        variant: "destructive"
      })
      return
    }

    setFile(selectedFile)
    toast({
      title: "File selected",
      description: `${selectedFile.name} is ready to process`
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
      // Read the file
      const arrayBuffer = await file.arrayBuffer()
      
      // Dynamically import xlsx library
      const XLSX = await import('xlsx')
      
      // Parse the spreadsheet
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert to JSON (array of arrays)
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      
      // Parse questions from the spreadsheet
      const questions = parseSpreadsheet(data as any[][])
      
      if (questions.length === 0) {
        toast({
          title: "No questions found",
          description: "Could not find any valid questions in the spreadsheet. Please check the format.",
          variant: "destructive"
        })
        setIsProcessing(false)
        return
      }
      
      // Generate assessment
      const assessment = generateAssessment(questions)
      
      // Save assessment result
      saveAssessmentResult(assessment)
      
      toast({
        title: "Assessment complete!",
        description: `Processed ${questions.length} questions from your spreadsheet`
      })
      
      // Navigate to results page
      router.push('/upload-assessment/results')
      
    } catch (error) {
      console.error('[v0] Error processing spreadsheet:', error)
      toast({
        title: "Processing error",
        description: "Failed to process the spreadsheet. Please ensure it's in the correct format.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
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
        {/* Drag and drop area */}
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
              {file ? <FileSpreadsheet className="h-8 w-8 text-blue-600" /> : <Upload className="h-8 w-8 text-blue-600" />}
            </div>
            
            {file ? (
              <div>
                <p className="text-lg font-medium">{file.name}</p>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drag and drop your spreadsheet here</p>
                <p className="text-sm text-gray-600">or click the button below to browse</p>
              </div>
            )}
            
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  {file ? "Choose Different File" : "Choose File"}
                </span>
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

        {/* Supported formats */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Supported formats</p>
              <ul className="text-blue-800 space-y-1">
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• CSV files (.csv)</li>
                <li>• Must contain question numbers (e.g., A1.1, A2.5)</li>
                <li>• Must have your answers filled in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process button */}
        <Button
          onClick={processSpreadsheet}
          disabled={!file || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Process Assessment"}
        </Button>
      </CardContent>
    </Card>
  )
}
