"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AssessmentResultsDisplay } from "@/components/assessment-results-display"
import { getStoredAssessmentResult } from "@/lib/spreadsheet-assessment"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AssessmentResultsPage() {
  const [result, setResult] = useState<{ result: any; timestamp: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = getStoredAssessmentResult()
    setResult(storedResult)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading assessment results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/upload-assessment">
            <Button variant="outline" size="sm" className="flex items-center gap-1 mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Upload
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              No assessment results are available. Please upload a spreadsheet first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/upload-assessment">
              <Button>Upload Assessment Spreadsheet</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/upload-assessment">
          <Button variant="outline" size="sm" className="flex items-center gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back to Upload
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Assessment Results</h1>
        <p className="text-gray-600">
          Review your automated assessment results and identify areas for improvement
        </p>
      </div>

      <AssessmentResultsDisplay 
        result={result.result} 
        timestamp={result.timestamp}
        source="upload"
      />
    </div>
  )
}
