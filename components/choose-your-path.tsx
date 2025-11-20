"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Route, ArrowRight } from "lucide-react"

export function ChooseYourPath() {
  const handleScrollToProgress = () => {
    const progressSection = document.querySelector('[data-section="overall-progress"]')
    if (progressSection) {
      progressSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Choose Your Path</h2>
        <p className="text-muted-foreground">
          Select the approach that best fits your needs: get a quick assessment or follow a structured guided journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Assessment Card */}
        <Link href="/upload-assessment">
          <Card className="h-full cursor-pointer hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold text-purple-700 dark:text-purple-400">Quick Assessment</CardTitle>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Upload className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-base">
                Already have your answers ready? Upload a spreadsheet or paste your assessment questions for instant
                automated analysis and progress tracking.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Fast results and instant feedback</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Automated progress analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  <span>Perfect for those who already know the answers</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-base font-medium text-purple-600 dark:text-purple-400">
                Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Guided Journey Card */}
        <div onClick={handleScrollToProgress} className="cursor-pointer">
          <Card className="h-full hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">Guided Journey</CardTitle>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-base">
                Need help understanding the requirements? Work through each section step-by-step with detailed guidance,
                platform-specific instructions, and progress tracking.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>Step-by-step guidance for each requirement</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>Platform-specific instructions (Windows, macOS, etc.)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span>Perfect for comprehensive preparation</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-base font-medium text-blue-600 dark:text-blue-400">
                Continue below <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
