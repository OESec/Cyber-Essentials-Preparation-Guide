"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Download, FileText, Upload, Scan, FolderOpen } from "lucide-react"

export default function EvidenceCollector() {
  const [activeTab, setActiveTab] = useState("auto-collect")
  const [collecting, setCollecting] = useState(false)
  const [collected, setCollected] = useState(false)
  const [evidenceItems, setEvidenceItems] = useState<string[]>([])

  const handleCollect = () => {
    setCollecting(true)
    // Simulate evidence collection
    setTimeout(() => {
      setCollecting(false)
      setCollected(true)
      setEvidenceItems([
        "Password Policy Document",
        "Multi-Factor Authentication Settings",
        "Firewall Configuration Export",
        "Antivirus Status Report",
        "Software Update Policy",
        "User Access Control Matrix",
        "Network Security Configuration",
        "Backup and Recovery Procedures",
      ])
    }, 3000)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Scan className="h-6 w-6" />
          Auto-Generated Evidence Collection
        </CardTitle>
        <CardDescription>
          Automatically scan and collect evidence for your Cyber Essentials certification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="auto-collect" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auto-collect">Auto-Collect Evidence</TabsTrigger>
            <TabsTrigger value="manual-upload">Manual Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="auto-collect" className="space-y-4">
            {!collected ? (
              <div className="space-y-4 py-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Evidence Collection Areas</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Select which areas to scan for evidence collection:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scan-policies" defaultChecked />
                    <Label htmlFor="scan-policies" className="text-sm">
                      Security policies and procedures documents
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scan-configs" defaultChecked />
                    <Label htmlFor="scan-configs" className="text-sm">
                      System configurations and settings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scan-updates" defaultChecked />
                    <Label htmlFor="scan-updates" className="text-sm">
                      Software update and patch management records
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scan-access" defaultChecked />
                    <Label htmlFor="scan-access" className="text-sm">
                      User access controls and permissions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="scan-malware" defaultChecked />
                    <Label htmlFor="scan-malware" className="text-sm">
                      Malware protection and scanning reports
                    </Label>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> The evidence collection will scan your systems for relevant documentation and
                    configuration files. This process is read-only and will not modify any settings.
                  </p>
                </div>

                <Button onClick={handleCollect} disabled={collecting} className="w-full" size="lg">
                  {collecting ? (
                    <>
                      <Scan className="mr-2 h-4 w-4 animate-spin" />
                      Scanning Systems...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Start Evidence Collection
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Evidence collection complete
                      </h3>
                      <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                        <p>{evidenceItems.length} evidence items were automatically collected and organized.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Collected Evidence:</h4>
                  {evidenceItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-gray-500" />
                        <div>
                          <span className="font-medium">{item}</span>
                          <p className="text-sm text-gray-500">Auto-collected • Ready for review</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setCollected(false)} variant="outline" className="flex-1">
                    Collect Again
                  </Button>
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export All Evidence
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual-upload" className="space-y-4">
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence-title">Evidence Title</Label>
                <Input id="evidence-title" placeholder="e.g., Password Policy Document" />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence-description">Description</Label>
                <Textarea
                  id="evidence-description"
                  placeholder="Describe what this evidence demonstrates for Cyber Essentials compliance..."
                  rows={3}
                />
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence-category">Cyber Essentials Control</Label>
                <select
                  id="evidence-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a control...</option>
                  <option value="firewalls">Firewalls & Internet Gateways</option>
                  <option value="secure-config">Secure Configuration</option>
                  <option value="access-control">User Access Control</option>
                  <option value="malware">Malware Protection</option>
                  <option value="updates">Security Update Management</option>
                </select>
              </div>

              <div className="grid w-full gap-1.5">
                <Label htmlFor="evidence-file">Upload Evidence File</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="evidence-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, PNG, JPG, TXT (MAX. 10MB)</p>
                    </div>
                    <input id="evidence-file" type="file" className="hidden" accept=".pdf,.docx,.png,.jpg,.jpeg,.txt" />
                  </label>
                </div>
              </div>

              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Evidence
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">
          <FolderOpen className="mr-2 h-4 w-4" />
          View Evidence Library
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Evidence Package
        </Button>
      </CardFooter>
    </Card>
  )
}
