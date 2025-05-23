"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Download, Pencil, FileIcon as FileTemplate, Settings, Eye } from "lucide-react"

const TEMPLATE_CATEGORIES = [
  { id: "policies", name: "Security Policies", icon: "📋" },
  { id: "procedures", name: "Procedures", icon: "⚙️" },
  { id: "training", name: "Training Materials", icon: "🎓" },
  { id: "incident", name: "Incident Response", icon: "🚨" },
  { id: "compliance", name: "Compliance Documents", icon: "✅" },
]

const TEMPLATES = [
  {
    id: 1,
    name: "Password Policy",
    category: "policies",
    description: "Comprehensive password policy meeting Cyber Essentials requirements",
    sections: ["Introduction", "Scope", "Password Requirements", "Implementation", "Compliance"],
  },
  {
    id: 2,
    name: "Acceptable Use Policy",
    category: "policies",
    description: "Guidelines for appropriate use of IT systems and data",
    sections: ["Purpose", "Scope", "Acceptable Use", "Prohibited Activities", "Enforcement"],
  },
  {
    id: 3,
    name: "Security Awareness Training Plan",
    category: "training",
    description: "Structured training program for employee security awareness",
    sections: ["Training Objectives", "Target Audience", "Training Content", "Delivery Methods", "Assessment"],
  },
  {
    id: 4,
    name: "Incident Response Plan",
    category: "incident",
    description: "Step-by-step procedures for responding to security incidents",
    sections: ["Incident Classification", "Response Team", "Response Procedures", "Communication", "Recovery"],
  },
  {
    id: 5,
    name: "Data Backup Procedure",
    category: "procedures",
    description: "Comprehensive backup and recovery procedures",
    sections: ["Backup Schedule", "Backup Types", "Storage Requirements", "Testing", "Recovery Procedures"],
  },
  {
    id: 6,
    name: "Software Update Management",
    category: "procedures",
    description: "Process for managing software updates and patches",
    sections: ["Update Policy", "Testing Process", "Deployment Schedule", "Emergency Updates", "Documentation"],
  },
  {
    id: 7,
    name: "Cyber Essentials Self-Assessment",
    category: "compliance",
    description: "Template for documenting Cyber Essentials compliance",
    sections: ["Organization Details", "Scope Definition", "Control Implementation", "Evidence Collection", "Review"],
  },
]

export default function TemplateGenerator() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customizing, setCustomizing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const filteredTemplates =
    activeCategory === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

  const handleGenerateDocument = () => {
    setGenerating(true)
    // Simulate document generation
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  const selectedTemplateData = TEMPLATES.find((t) => t.id === selectedTemplate)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <FileTemplate className="h-6 w-6" />
          Dynamic Documentation Templates
        </CardTitle>
        <CardDescription>
          Generate customized documentation templates that adapt to your organization's specific needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!customizing && !previewMode ? (
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                All Templates
              </Button>
              {TEMPLATE_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg">{template.name}</h3>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTemplate(template.id)
                          setPreviewMode(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTemplate(template.id)
                          setCustomizing(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {section}
                      </span>
                    ))}
                    {template.sections.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.sections.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setCustomizing(true)} disabled={selectedTemplate === null}>
                <Settings className="mr-2 h-4 w-4" />
                Customize Template
              </Button>
              <Button onClick={handleGenerateDocument} disabled={selectedTemplate === null || generating}>
                {generating ? "Generating..." : "Generate Document"}
              </Button>
            </div>

            {/* Success Message */}
            {generated && (
              <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Document generated successfully
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Your customized {selectedTemplateData?.name} document is ready for download.</p>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Download Document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : previewMode ? (
          /* Template Preview */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Preview: {selectedTemplateData?.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
                Back to Templates
              </Button>
            </div>

            <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold">{selectedTemplateData?.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">[Your Organization Name]</p>
                  <p className="text-sm text-gray-500">Document Version 1.0 | [Current Date]</p>
                </div>

                {selectedTemplateData?.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h2 className="text-lg font-semibold text-blue-600">
                      {index + 1}. {section}
                    </h2>
                    <div className="pl-4 text-gray-600 dark:text-gray-400">
                      <p className="italic">
                        [This section will be populated with content specific to {section.toLowerCase()} based on your
                        organization's requirements and Cyber Essentials compliance needs.]
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCustomizing(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Customize This Template
              </Button>
              <Button onClick={handleGenerateDocument}>Generate Document</Button>
            </div>
          </div>
        ) : (
          /* Customization Form */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Customize: {selectedTemplateData?.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setCustomizing(false)}>
                Back to Templates
              </Button>
            </div>

            <Tabs defaultValue="organization" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="formatting">Formatting</TabsTrigger>
              </TabsList>

              <TabsContent value="organization" className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Your Organization Name" />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="org-address">Organization Address</Label>
                  <Textarea id="org-address" placeholder="Your Organization Address" rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="contact-person">Primary Contact</Label>
                    <Input id="contact-person" placeholder="Contact Person Name" />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" placeholder="contact@organization.com" />
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="org-description">Organization Description</Label>
                  <Textarea
                    id="org-description"
                    placeholder="Brief description of your organization's business and activities..."
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="template-sections">Sections to Include</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    {selectedTemplateData?.sections.map((section, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`section-${index}`}
                          className="rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor={`section-${index}`} className="flex-1">
                          {section}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="additional-sections">Additional Sections</Label>
                  <Textarea
                    id="additional-sections"
                    placeholder="Enter any additional sections you'd like to include, one per line..."
                    rows={3}
                  />
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="compliance-focus">Compliance Focus Areas</Label>
                  <div className="space-y-2 border rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="focus-firewalls" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="focus-firewalls">Firewalls & Internet Gateways</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="focus-config" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="focus-config">Secure Configuration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="focus-access" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="focus-access">User Access Control</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="focus-malware" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="focus-malware">Malware Protection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="focus-updates" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="focus-updates">Security Update Management</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="formatting" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="doc-format">Document Format</Label>
                    <select
                      id="doc-format"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="docx">Microsoft Word (.docx)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="html">HTML Document (.html)</option>
                    </select>
                  </div>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="doc-style">Document Style</Label>
                    <select
                      id="doc-style"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="professional">Professional</option>
                      <option value="corporate">Corporate</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="header-footer">Include Header/Footer</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-header" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="include-header">Include organization header</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-footer" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="include-footer">Include page numbers and date</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="include-toc" className="rounded border-gray-300" defaultChecked />
                      <Label htmlFor="include-toc">Include table of contents</Label>
                    </div>
                  </div>
                </div>

                <div className="grid w-full gap-1.5">
                  <Label htmlFor="additional-notes">Additional Formatting Notes</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Any specific formatting requirements or notes..."
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setCustomizing(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateDocument} disabled={generating}>
                {generating ? "Generating..." : "Generate Custom Document"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
