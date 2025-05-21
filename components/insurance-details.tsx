"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, Shield, FileText, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

export function InsuranceDetails() {
  const [showFullDetails, setShowFullDetails] = useState(false)

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle>Cyber Essentials Insurance Coverage</CardTitle>
        </div>
        <CardDescription>
          Detailed information about the insurance coverage included with your Cyber Essentials certification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
            <TabsTrigger value="benefits">Key Benefits</TabsTrigger>
            <TabsTrigger value="claims">Claims Process</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">About the Insurance</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Cyber Essentials certification includes cyber insurance for eligible organizations at no
                        additional cost. This insurance is underwritten by a leading cyber insurer and is designed to
                        help small and medium-sized businesses recover from a cyber incident.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Eligibility Requirements</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm">
                    <li>Head office domiciled in the UK or Crown Dependencies</li>
                    <li>Gross annual turnover less than £20 million</li>
                    <li>Valid Cyber Essentials certification</li>
                    <li>Whole organization covered by the certification</li>
                  </ul>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Key Coverage Limits</h3>
                  <ul className="ml-5 list-disc space-y-1 text-sm">
                    <li>£25,000 limit of liability per claim</li>
                    <li>First-party losses and third-party claims covered</li>
                    <li>£0 excess/deductible</li>
                    <li>12-month coverage period from certification date</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="outline" onClick={() => setShowFullDetails(!showFullDetails)} className="mt-2">
                  {showFullDetails ? "Show Less" : "Show More Details"}
                </Button>
              </div>

              {showFullDetails && (
                <div className="mt-4 rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Insurance Provider Information</h3>
                  <p className="text-sm text-gray-600">
                    The cyber insurance is provided through the IASME Consortium and is underwritten by a major UK
                    insurer. Upon certification, eligible organizations will receive their insurance documentation via
                    email from the designated insurance broker.
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    The insurance is automatically renewed with your annual Cyber Essentials certification, provided you
                    maintain eligibility. There is no need to pay any additional premium as the insurance is included in
                    your certification cost.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="coverage" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Coverage Details</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        The insurance provides coverage for a range of cyber incidents, helping your organization
                        recover from financial losses and manage third-party claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>What's Covered</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-5 list-disc space-y-2 text-sm">
                      <li>
                        <span className="font-medium">First-Party Losses:</span> Direct financial losses to your
                        organization resulting from a cyber incident
                      </li>
                      <li>
                        <span className="font-medium">Business Interruption:</span> Loss of income and extra expenses
                        incurred due to a cyber incident
                      </li>
                      <li>
                        <span className="font-medium">Data Recovery Costs:</span> Expenses to restore or recreate data
                        lost in a cyber incident
                      </li>
                      <li>
                        <span className="font-medium">Cyber Extortion:</span> Ransom payments and related expenses in
                        response to a cyber extortion threat
                      </li>
                      <li>
                        <span className="font-medium">Crisis Management:</span> Public relations expenses to manage
                        reputational damage
                      </li>
                      <li>
                        <span className="font-medium">Regulatory Defense:</span> Legal costs to defend against
                        regulatory actions related to a data breach
                      </li>
                      <li>
                        <span className="font-medium">Third-Party Claims:</span> Liability for claims made against your
                        organization by third parties
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span>What's Not Covered</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-5 list-disc space-y-2 text-sm">
                      <li>
                        <span className="font-medium">Pre-existing Conditions:</span> Incidents or circumstances known
                        before the policy start date
                      </li>
                      <li>
                        <span className="font-medium">Bodily Injury and Property Damage:</span> Physical harm to people
                        or damage to tangible property
                      </li>
                      <li>
                        <span className="font-medium">Infrastructure Failure:</span> Failures in power, utility, or
                        telecommunications services not under your control
                      </li>
                      <li>
                        <span className="font-medium">War and Terrorism:</span> Acts of war, terrorism, or similar
                        events
                      </li>
                      <li>
                        <span className="font-medium">Intellectual Property:</span> Infringement of patents or trade
                        secrets
                      </li>
                      <li>
                        <span className="font-medium">Intentional Acts:</span> Dishonest, fraudulent, or criminal acts
                        by the insured
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-gray-600">
                      <em>
                        Note: This is a summary of key exclusions. Please refer to the full policy documentation for
                        complete details.
                      </em>
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>Coverage Limits and Terms</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Limit of Liability:</span> £25,000 per claim and in the aggregate
                      </div>
                      <div>
                        <span className="font-medium">Excess/Deductible:</span> £0 (no excess)
                      </div>
                      <div>
                        <span className="font-medium">Coverage Period:</span> 12 months from the date of Cyber
                        Essentials certification
                      </div>
                      <div>
                        <span className="font-medium">Territorial Scope:</span> United Kingdom and Crown Dependencies
                      </div>
                      <div>
                        <span className="font-medium">Retroactive Date:</span> Policy inception date (no retroactive
                        coverage)
                      </div>
                      <div>
                        <span className="font-medium">Notification Period:</span> Claims must be reported within 90 days
                        of discovery
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Key Benefits</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        The included cyber insurance provides several important benefits to help protect your business
                        from the financial impact of cyber incidents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Financial Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Provides financial coverage for losses resulting from cyber incidents, helping your business
                      recover without significant financial strain.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">No Additional Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Included at no extra charge with your Cyber Essentials certification, providing valuable coverage
                      without increasing your certification costs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Zero Excess</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      No deductible or excess to pay when making a claim, ensuring you receive the full benefit of the
                      coverage from the first pound of loss.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Expert Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Access to expert advice and support when responding to a cyber incident, helping you manage the
                      situation effectively.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Automatic Renewal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Insurance coverage renews automatically with your annual Cyber Essentials certification, ensuring
                      continuous protection.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Competitive Advantage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Demonstrates to clients and partners that your business is protected against cyber risks,
                      enhancing your reputation and trustworthiness.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 flex items-center gap-2 font-medium">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Why This Matters for SMEs
                </h3>
                <p className="text-sm text-gray-600">
                  Small and medium-sized enterprises are increasingly targeted by cybercriminals but often lack the
                  financial resources to recover from cyber incidents. This insurance provides a safety net that can
                  make the difference between recovering from an incident and suffering long-term business damage.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  The £25,000 coverage limit is particularly valuable for smaller organizations where this amount can
                  cover a significant portion of incident response costs, including IT forensics, data recovery, and
                  legal advice.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="claims" className="pt-4">
            <div className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Claims Process</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        In the event of a cyber incident, follow these steps to make a claim under your Cyber Essentials
                        insurance policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    1
                  </div>
                  <h3 className="font-medium">Identify the Incident</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Recognize and document the cyber incident as soon as it's discovered. Note the date, time, and
                    nature of the incident.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    2
                  </div>
                  <h3 className="font-medium">Notify the Insurer</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Contact the insurance provider using the details in your policy documentation. This should be done
                    as soon as possible and within 90 days of discovering the incident.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    3
                  </div>
                  <h3 className="font-medium">Provide Initial Information</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Supply basic details about the incident, including your policy number, the nature of the incident,
                    when it was discovered, and any immediate actions taken.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    4
                  </div>
                  <h3 className="font-medium">Follow Insurer's Guidance</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    The insurer will provide instructions on next steps, which may include engaging approved incident
                    response specialists or preserving evidence.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    5
                  </div>
                  <h3 className="font-medium">Document Losses and Expenses</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Keep detailed records of all costs and losses associated with the incident, including invoices,
                    receipts, and time logs.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    6
                  </div>
                  <h3 className="font-medium">Complete Claim Forms</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Fill out any claim forms provided by the insurer, providing all requested information and supporting
                    documentation.
                  </p>
                </div>

                <div className="relative pl-8 pt-2">
                  <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    7
                  </div>
                  <h3 className="font-medium">Claim Assessment and Payment</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    The insurer will assess your claim and, if approved, arrange payment up to the policy limit of
                    £25,000.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Important Reminders</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <ul className="ml-5 list-disc space-y-1">
                        <li>Report incidents as soon as possible (within 90 days maximum)</li>
                        <li>Do not admit liability or make any offers to third parties without insurer approval</li>
                        <li>Preserve all evidence related to the cyber incident</li>
                        <li>Follow any security recommendations provided by the insurer or their representatives</li>
                        <li>
                          Keep the insurer informed of any developments, including potential third-party claims or
                          regulatory inquiries
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 px-6 py-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Included with Certification
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              £0 Excess
            </Badge>
          </div>
          <Button variant="link" size="sm" className="text-blue-600" asChild>
            <a
              href="https://iasme.co.uk/cyber-essentials/cyber-liability-insurance/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Official Insurance Information
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
