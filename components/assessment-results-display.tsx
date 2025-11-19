"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { AssessmentResult } from "@/lib/spreadsheet-assessment"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

interface AssessmentResultsDisplayProps {
  result: AssessmentResult
  timestamp?: string
  source?: 'upload' | 'paste'
}

export function AssessmentResultsDisplay({ result, timestamp, source = 'upload' }: AssessmentResultsDisplayProps) {
  const { overallScore, sectionResults, flaggedIssues, passedQuestions, summary } = result

  const highIssues = flaggedIssues.filter(i => i.severity === 'high')
  const mediumIssues = flaggedIssues.filter(i => i.severity === 'medium')
  const lowIssues = flaggedIssues.filter(i => i.severity === 'low')

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Results</CardTitle>
          {timestamp && (
            <CardDescription>
              Processed on {new Date(timestamp).toLocaleDateString()} at {new Date(timestamp).toLocaleTimeString()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Completeness</span>
              <span className="text-2xl font-bold">{Math.round(overallScore)}%</span>
            </div>
            <Progress value={overallScore} className="h-3" />
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Summary</AlertTitle>
            <AlertDescription>{summary}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {passedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Passed Questions ({passedQuestions.length})</CardTitle>
            <CardDescription>Questions with acceptable answers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-green-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead className="font-semibold text-green-900">Question</TableHead>
                    <TableHead className="font-semibold text-green-900">Response</TableHead>
                    <TableHead className="font-semibold text-green-900">Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passedQuestions.map((question, index) => (
                    <TableRow key={index} className="bg-green-50/30">
                      <TableCell className="font-medium">
                        <span className="text-green-700">{question.questionNo}:</span> {question.question}
                      </TableCell>
                      <TableCell className="text-gray-700">{question.userAnswer}</TableCell>
                      <TableCell className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Acceptable answer
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Summary */}
      {flaggedIssues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Issues ({flaggedIssues.length})</CardTitle>
            <CardDescription>Items that require attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highIssues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">High Severity ({highIssues.length})</h3>
                </div>
                <div className="border border-red-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50">
                        <TableHead className="font-semibold text-red-900">Question</TableHead>
                        <TableHead className="font-semibold text-red-900">Response</TableHead>
                        <TableHead className="font-semibold text-red-900">Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {highIssues.map((issue, index) => (
                        <TableRow key={index} className="bg-red-50/50">
                          <TableCell className="font-medium">
                            <span className="text-red-700">{issue.questionNo}:</span> {issue.question}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {issue.userAnswer || <span className="text-red-400 italic">No answer provided</span>}
                          </TableCell>
                          <TableCell className="text-red-700">{issue.issue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {mediumIssues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="font-medium">Medium Severity ({mediumIssues.length})</h3>
                </div>
                <div className="border border-yellow-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-yellow-50">
                        <TableHead className="font-semibold text-yellow-900">Question</TableHead>
                        <TableHead className="font-semibold text-yellow-900">Response</TableHead>
                        <TableHead className="font-semibold text-yellow-900">Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mediumIssues.map((issue, index) => (
                        <TableRow key={index} className="bg-yellow-50/50">
                          <TableCell className="font-medium">
                            <span className="text-yellow-700">{issue.questionNo}:</span> {issue.question}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {issue.userAnswer || <span className="text-yellow-400 italic">No answer provided</span>}
                          </TableCell>
                          <TableCell className="text-yellow-700">{issue.issue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {lowIssues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-600">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Low Severity ({lowIssues.length})</h3>
                </div>
                <div className="border border-blue-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead className="font-semibold text-blue-900">Question</TableHead>
                        <TableHead className="font-semibold text-blue-900">Response</TableHead>
                        <TableHead className="font-semibold text-blue-900">Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowIssues.map((issue, index) => (
                        <TableRow key={index} className="bg-blue-50/50">
                          <TableCell className="font-medium">
                            <span className="text-blue-700">{issue.questionNo}:</span> {issue.question}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {issue.userAnswer || <span className="text-blue-400 italic">No answer provided</span>}
                          </TableCell>
                          <TableCell className="text-blue-700">{issue.issue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Section-by-Section Breakdown</CardTitle>
          <CardDescription>Performance across all Cyber Essentials sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sectionResults.map((section) => (
            <div key={section.sectionId} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{section.sectionName}</h3>
                  <p className="text-sm text-gray-600">
                    {section.answeredQuestions} of {section.totalQuestions} questions complete
                  </p>
                </div>
                <span className="text-lg font-bold">{Math.round(section.score)}%</span>
              </div>
              <Progress value={section.score} className="h-2" />
              
              {section.issues.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                  <p className="font-medium">{section.issues.length} issue{section.issues.length > 1 ? 's' : ''} in this section</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {source === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Recommended actions based on your assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overallScore < 100 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Continue Your Assessment</AlertTitle>
                <AlertDescription>
                  Review the flagged issues and complete any missing answers in your spreadsheet.
                  Once updated, you can upload it again for a new assessment.
                </AlertDescription>
              </Alert>
            )}
            
            {overallScore >= 90 && (
              <Alert className="border-green-300 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Nearly Ready for Submission</AlertTitle>
                <AlertDescription className="text-green-800">
                  Your assessment is looking great! Address any remaining issues and you'll be ready to submit for Cyber Essentials certification.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-3">
              <Link href="/upload-assessment">
                <Button variant="outline">
                  Upload New Version
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button>
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
