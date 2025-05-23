import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EvidenceCollector from "@/components/smart-documentation/evidence-collector"
import TemplateGenerator from "@/components/smart-documentation/template-generator"
import Link from "next/link"
import { ArrowLeft, FileText, ShieldCheck, Lightbulb, Target } from "lucide-react"

export default function SmartDocumentationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Smart Documentation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Streamline your certification process with intelligent documentation tools
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-blue-800 dark:text-blue-200">Automated Collection</h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Automatically scan and collect evidence from your systems for faster certification.
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-800 dark:text-green-200">Dynamic Templates</h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Generate customized documentation that adapts to your organization's specific needs.
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h3 className="font-medium text-purple-800 dark:text-purple-200">Intelligent Guidance</h3>
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Get smart recommendations based on your certification progress and requirements.
          </p>
        </div>
      </div>

      <Tabs defaultValue="evidence" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="evidence" className="text-base py-3">
            <FileText className="mr-2 h-5 w-5" />
            Evidence Collection
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-base py-3">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Documentation Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evidence">
          <EvidenceCollector />
        </TabsContent>

        <TabsContent value="templates">
          <TemplateGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
