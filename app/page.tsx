import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, FileText, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Cyber Essentials Preparation Guide
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A practical step-by-step guide for Small and Medium Enterprises with no prior Information Security knowledge
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Simple & Practical</CardTitle>
              <CardDescription>Clear instructions with no technical jargon</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Follow straightforward steps designed specifically for businesses with no prior cybersecurity knowledge.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>Save your progress and continue later</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Mark individual steps as complete and save your progress at any time. Return exactly where you left off.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Platform Specific</CardTitle>
              <CardDescription>Instructions for Windows, macOS, and more</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Get tailored guidance for your specific platforms and systems, whether you use Windows, macOS, or other
                systems.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Your Preparation <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
