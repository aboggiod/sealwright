"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { generateAOO, type AOOFormData } from "@/lib/aoo-generator";

// NY Counties for the dropdown
const NY_COUNTIES = [
  "Albany", "Allegany", "Bronx", "Broome", "Cattaraugus", "Cayuga", "Chautauqua",
  "Chemung", "Chenango", "Clinton", "Columbia", "Cortland", "Delaware", "Dutchess",
  "Erie", "Essex", "Franklin", "Fulton", "Genesee", "Greene", "Hamilton", "Herkimer",
  "Jefferson", "Kings", "Lewis", "Livingston", "Madison", "Monroe", "Montgomery",
  "Nassau", "New York", "Niagara", "Oneida", "Onondaga", "Ontario", "Orange",
  "Orleans", "Oswego", "Otsego", "Putnam", "Queens", "Rensselaer", "Richmond",
  "Rockland", "St. Lawrence", "Saratoga", "Schenectady", "Schoharie", "Schuyler",
  "Seneca", "Steuben", "Suffolk", "Sullivan", "Tioga", "Tompkins", "Ulster",
  "Warren", "Washington", "Wayne", "Westchester", "Wyoming", "Yates"
];

// Phone number formatting function
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

// Validation schema with comprehensive checks
const formSchema = z.object({
  // Step 1: Name Determination
  llcName: z.string()
    .min(3, "LLC name must be at least 3 characters")
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        return lower.endsWith("llc") ||
               lower.endsWith("l.l.c.") ||
               lower.endsWith("limited liability company");
      },
      "LLC name must end with 'LLC', 'L.L.C.', or 'Limited Liability Company'"
    ),
  llcNameAlt1: z.string().optional(),
  llcNameAlt2: z.string().optional(),

  // Step 2: Name Verification & County
  county: z.string().min(1, "Please select a county"),
  includeOpeningStatement: z.boolean(),
  hasNonEnglishWords: z.boolean(),
  nonEnglishTranslation: z.string().optional(),
  includePurposeClause: z.boolean(),
  specificPurpose: z.string().optional(),

  // Step 3: Service of Process / Registered Agent
  forwardingName: z.string().min(2, "Name is required"),
  forwardingAddress: z.string().min(10, "Complete address required"),
  forwardingCity: z.string().min(2, "City is required"),
  forwardingState: z.string().min(2, "State is required"),
  forwardingZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),

  includeRegisteredAgent: z.boolean(),
  registeredAgentName: z.string().optional(),
  registeredAgentAddress: z.string().optional(),
  registeredAgentCity: z.string().optional(),
  registeredAgentZip: z.string().optional(),

  // Step 4: Optional Statements
  includeManagementStructure: z.boolean(),
  managementType: z.enum(["member", "manager"]).optional(),
  managerNames: z.string().optional(),

  includeEffectiveDate: z.boolean(),
  effectiveDate: z.string().optional(),

  includeDissolutionDate: z.boolean(),
  dissolutionDate: z.string().optional(),

  includeLiabilityStatement: z.boolean(),

  // Step 5: Organizer & Filer Information
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerAddress: z.string().min(10, "Complete address required"),
  organizerCity: z.string().min(2, "City is required"),
  organizerState: z.string().min(2, "State is required"),
  organizerZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),

  filerName: z.string().min(2, "Filer name is required"),
  filerEmail: z.string().email("Invalid email address"),
  filerPhone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$/, "Invalid phone number format"),
  filerAddress: z.string().min(10, "Complete address required"),
  filerCity: z.string().min(2, "City is required"),
  filerState: z.string().min(2, "State is required"),
  filerZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),

  // Additional services
  addRegisteredAgentService: z.boolean(),
  addBusinessAddress: z.boolean(),
});

export default function LLCFormationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedAOO, setGeneratedAOO] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched", // Only validate after field is touched
    defaultValues: {
      llcName: "",
      llcNameAlt1: "",
      llcNameAlt2: "",
      county: "",
      includeOpeningStatement: false,
      hasNonEnglishWords: false,
      nonEnglishTranslation: "",
      includePurposeClause: true, // Most people include this
      specificPurpose: "",
      forwardingName: "",
      forwardingAddress: "",
      forwardingCity: "",
      forwardingState: "NY",
      forwardingZip: "",
      includeRegisteredAgent: false,
      registeredAgentName: "",
      registeredAgentAddress: "",
      registeredAgentCity: "",
      registeredAgentZip: "",
      includeManagementStructure: false,
      managementType: "member",
      managerNames: "",
      includeEffectiveDate: false,
      effectiveDate: "",
      includeDissolutionDate: false,
      dissolutionDate: "",
      includeLiabilityStatement: false,
      organizerName: "",
      organizerAddress: "",
      organizerCity: "",
      organizerState: "NY",
      organizerZip: "",
      filerName: "",
      filerEmail: "",
      filerPhone: "",
      filerAddress: "",
      filerCity: "",
      filerState: "NY",
      filerZip: "",
      addRegisteredAgentService: false,
      addBusinessAddress: false,
    },
  });

  const watchedValues = form.watch();

  const calculateTotal = () => {
    let total = 599; // Base LLC formation (includes filing + publication + service)
    if (watchedValues.addRegisteredAgentService) total += 149;
    if (watchedValues.addBusinessAddress) total += 99;
    return total;
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = [];

    switch (currentStep) {
      case 1: // Name Determination
        fieldsToValidate = ["llcName"];
        break;
      case 2: // Name Verification & County
        fieldsToValidate = ["county"];
        if (watchedValues.hasNonEnglishWords) {
          fieldsToValidate.push("nonEnglishTranslation");
        }
        break;
      case 3: // Service of Process
        fieldsToValidate = ["forwardingName", "forwardingAddress", "forwardingCity", "forwardingState", "forwardingZip"];
        if (watchedValues.includeRegisteredAgent) {
          fieldsToValidate.push("registeredAgentName", "registeredAgentAddress", "registeredAgentCity", "registeredAgentZip");
        }
        break;
      case 4: // Optional Statements
        if (watchedValues.includeEffectiveDate) {
          fieldsToValidate.push("effectiveDate");
        }
        if (watchedValues.includeDissolutionDate) {
          fieldsToValidate.push("dissolutionDate");
        }
        break;
      case 5: // Organizer & Filer Information
        fieldsToValidate = [
          "organizerName", "organizerAddress", "organizerCity", "organizerState", "organizerZip",
          "filerName", "filerEmail", "filerPhone", "filerAddress", "filerCity", "filerState", "filerZip"
        ];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const orderData = {
      ...values,
      service: "llc-formation",
      total: calculateTotal(),
      timestamp,
    };

    // Save to localStorage for record keeping
    localStorage.setItem(`llc-formation-${timestamp}`, JSON.stringify(orderData));

    // Generate the complete Articles of Organization document
    const aooDocument = generateAOO(values as AOOFormData);
    setGeneratedAOO(aooDocument);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1000);
  }

  const downloadAOOAsText = () => {
    const blob = new Blob([generatedAOO], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Articles_of_Organization_${form.getValues('llcName').replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printAOO = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Articles of Organization - ${form.getValues('llcName')}</title>
            <style>
              body { font-family: 'Times New Roman', serif; max-width: 8.5in; margin: 1in auto; line-height: 1.5; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 12pt; }
            </style>
          </head>
          <body>
            <pre>${generatedAOO}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  const startNewApplication = () => {
    setShowSuccess(false);
    setGeneratedAOO("");
    form.reset();
    setCurrentStep(1);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="border-2 border-accent">
            <CardHeader className="text-center border-b">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <CardTitle className="text-3xl font-display text-primary">Your Articles of Organization</CardTitle>
              <CardDescription className="text-lg">
                Complete and ready for organizer signature
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Alert Section */}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                  <div className="flex gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold text-green-900 mb-2">
                        Document Generated Successfully!
                      </h3>
                      <div className="text-green-800 space-y-2">
                        <p className="font-semibold">This document is ready to file with NYS Department of State.</p>
                        <p>
                          Your customized Articles of Organization has been generated based on your selections.
                          It includes only the optional provisions you selected.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-display text-xl font-bold text-primary mb-4">📋 Next Steps</h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">1.</span>
                      <span><strong>Review the document</strong> below carefully for accuracy</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">2.</span>
                      <span><strong>Download or print</strong> using the buttons below</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">3.</span>
                      <span><strong>Organizer must sign</strong> where indicated (physical signature required)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary flex-shrink-0">4.</span>
                      <span><strong>We will file</strong> the signed document with NYS Department of State and handle publication</span>
                    </li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center py-4 border-y">
                  <Button
                    onClick={downloadAOOAsText}
                    className="bg-accent hover:bg-accent/90 text-primary font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download as Text
                  </Button>
                  <Button
                    onClick={printAOO}
                    variant="outline"
                    className="font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / Save as PDF
                  </Button>
                  <Button
                    onClick={startNewApplication}
                    variant="outline"
                  >
                    Start New Application
                  </Button>
                  <Link href="/">
                    <Button variant="outline">Return Home</Button>
                  </Link>
                </div>

                {/* Document Preview */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-display text-xl font-bold text-primary">Document Preview</h3>
                    <div className="text-sm text-gray-600">
                      {generatedAOO.split('\n').filter(line => line.trim()).length} lines
                    </div>
                  </div>
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-inner max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                      {generatedAOO}
                    </pre>
                  </div>
                </div>

                {/* Information Box */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <h4 className="font-semibold text-primary mb-3">ℹ️ Important Information</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>This document contains only the sections you selected during the application process</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>The organizer signature is required before filing with NYS DOS</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Keep a copy for your records after signing</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Send the signed document to us and we&apos;ll handle the rest (filing + publication)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Note:</strong> To save as PDF, use your browser&apos;s &quot;Print to PDF&quot; option</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalSteps = 6;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-accent hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">New York LLC Formation</h1>
          <p className="text-xl text-gray-200">
            Professional business formation following NYS Department of State procedures
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Your Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-sm text-gray-600 mb-2">NYC Cost</div>
                  <div className="text-2xl font-bold text-gray-400 line-through">$2,500+</div>
                  <div className="text-sm text-gray-600 mt-4 mb-2">Albany Cost</div>
                  <div className="text-4xl font-display font-bold text-accent mb-2">$599</div>
                  <div className="inline-block bg-accent/10 text-primary px-4 py-2 rounded-full font-semibold">
                    Save $1,901 (76%)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Process Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { num: 1, title: "Name Determination", desc: "Choose your LLC name" },
                  { num: 2, title: "County & Options", desc: "Select county and clauses" },
                  { num: 3, title: "Service of Process", desc: "Forwarding address" },
                  { num: 4, title: "Optional Provisions", desc: "Management & dates" },
                  { num: 5, title: "Contact Information", desc: "Organizer & filer details" },
                  { num: 6, title: "Review & Submit", desc: "Confirm and complete" },
                ].map((step) => (
                  <div key={step.num} className={`flex gap-3 ${currentStep === step.num ? "opacity-100" : "opacity-50"}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === step.num
                        ? "bg-accent text-primary"
                        : currentStep > step.num
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${currentStep === step.num ? "text-primary" : "text-gray-700"}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-600">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="font-display text-primary text-sm">💡 Why Albany?</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-700 space-y-2">
                <p>
                  Publication costs vary wildly by county. NYC newspapers can charge $1,500+ for the required publication,
                  while Albany newspapers charge around $200.
                </p>
                <p className="font-semibold text-primary">
                  Same filing, same state, 87% less expensive!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="md:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-display text-primary">
                      {currentStep === 1 && "Name Determination"}
                      {currentStep === 2 && "Name Verification & County"}
                      {currentStep === 3 && "Service of Process"}
                      {currentStep === 4 && "Optional Provisions"}
                      {currentStep === 5 && "Organizer & Filer Information"}
                      {currentStep === 6 && "Review & Submit"}
                    </CardTitle>
                    <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-8 rounded-full ${
                          idx + 1 <= currentStep ? "bg-accent" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* Step 1: Name Determination */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                          <strong>Important:</strong> Your LLC name must include &quot;LLC&quot;, &quot;L.L.C.&quot;, or &quot;Limited Liability Company&quot;.
                          We recommend checking name availability on the{" "}
                          <a
                            href="https://apps.dos.ny.gov/publicInquiry/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            NYS Department of State website
                          </a>
                          {" "}before continuing.
                        </div>

                        <FormField
                          control={form.control}
                          name="llcName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desired LLC Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Example Business LLC" {...field} />
                              </FormControl>
                              <FormDescription>
                                First choice for your LLC name
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="llcNameAlt1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alternative Name 1 (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Backup name if first choice is unavailable" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="llcNameAlt2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alternative Name 2 (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Second backup option" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 2: Name Verification & County */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                          <div className="font-semibold text-primary mb-1">Selected LLC Name:</div>
                          <div className="text-lg">{watchedValues.llcName || "Not entered"}</div>
                        </div>

                        <FormField
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County for LLC Office *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a county" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[300px]">
                                  {NY_COUNTIES.map((county) => (
                                    <SelectItem key={county} value={county}>
                                      {county}
                                      {county === "Albany" && " (Recommended - Lowest publication cost)"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                This determines your publication newspaper and cost. Albany has the lowest publication costs.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="border-t pt-6">
                          <h3 className="font-semibold text-primary mb-4">Optional Clauses</h3>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="includeOpeningStatement"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Include Optional Opening Statement</FormLabel>
                                    <FormDescription>
                                      States that LLC is formed under NY LLC Law §203 by person(s) at least 18 years old. Most filers leave this unchecked.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="hasNonEnglishWords"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none flex-1">
                                    <FormLabel>LLC Name Contains Non-English Words</FormLabel>
                                    <FormDescription>
                                      If checked, you must provide an English translation
                                    </FormDescription>
                                    {field.value && (
                                      <div className="mt-3">
                                        <FormField
                                          control={form.control}
                                          name="nonEnglishTranslation"
                                          render={({ field: translationField }) => (
                                            <FormItem>
                                              <FormControl>
                                                <Input
                                                  placeholder="English translation of non-English words"
                                                  {...translationField}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="includePurposeClause"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-green-50">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 mt-1"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none flex-1">
                                    <FormLabel>Include General Purpose Clause (Recommended)</FormLabel>
                                    <FormDescription>
                                      &quot;To engage in any lawful act or activity for which an LLC may be formed.&quot; Most filers check this for broad business flexibility.
                                    </FormDescription>
                                    {field.value && (
                                      <div className="mt-3">
                                        <FormField
                                          control={form.control}
                                          name="specificPurpose"
                                          render={({ field: purposeField }) => (
                                            <FormItem>
                                              <FormLabel className="text-xs">Or specify a different purpose (optional):</FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  placeholder="Leave blank to use general purpose clause..."
                                                  className="min-h-[80px]"
                                                  {...purposeField}
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Service of Process / Registered Agent */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                          <strong>Service of Process:</strong> The NY Secretary of State is automatically designated as your agent
                          for service of process. You must provide an address where legal documents will be forwarded.
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-primary">Address for Forwarding Service of Process *</h3>

                          <FormField
                            control={form.control}
                            name="forwardingName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Individual or company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="forwardingAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormDescription>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:underline text-xs"
                                    onClick={() => {
                                      // TODO: Implement address lookup
                                      alert("Address lookup feature coming soon!");
                                    }}
                                  >
                                    🔍 Lookup Address
                                  </button>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="forwardingCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Albany" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="forwardingState"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State *</FormLabel>
                                  <FormControl>
                                    <Input value="NY" disabled {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="forwardingZip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12207" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <FormField
                            control={form.control}
                            name="includeRegisteredAgent"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 mt-1"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none flex-1">
                                  <FormLabel>Include Optional Registered Agent Designation</FormLabel>
                                  <FormDescription>
                                    Designate a specific registered agent in addition to the statutory SSNY agent. Most filers leave this unchecked.
                                  </FormDescription>
                                  {field.value && (
                                    <div className="mt-4 space-y-3 pl-0">
                                      <FormField
                                        control={form.control}
                                        name="registeredAgentName"
                                        render={({ field: agentField }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm">Registered Agent Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Agent name" {...agentField} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="registeredAgentAddress"
                                        render={({ field: agentField }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm">Registered Agent Address (NY only)</FormLabel>
                                            <FormControl>
                                              <Input placeholder="Physical NY address" {...agentField} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <div className="grid grid-cols-2 gap-3">
                                        <FormField
                                          control={form.control}
                                          name="registeredAgentCity"
                                          render={({ field: agentField }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm">City</FormLabel>
                                              <FormControl>
                                                <Input placeholder="City" {...agentField} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="registeredAgentZip"
                                          render={({ field: agentField }) => (
                                            <FormItem>
                                              <FormLabel className="text-sm">ZIP Code</FormLabel>
                                              <FormControl>
                                                <Input placeholder="12207" {...agentField} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 4: Optional Provisions */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                          These optional provisions can be included in your Articles of Organization. If left unchecked,
                          you can address these items in your Operating Agreement instead.
                        </div>

                        <FormField
                          control={form.control}
                          name="includeManagementStructure"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <FormLabel>Include Management Structure</FormLabel>
                                <FormDescription>
                                  Specify whether the LLC is member-managed or manager-managed. Most filers handle this in the Operating Agreement.
                                </FormDescription>
                                {field.value && (
                                  <div className="mt-4 space-y-3">
                                    <FormField
                                      control={form.control}
                                      name="managementType"
                                      render={({ field: mgmtField }) => (
                                        <FormItem>
                                          <Select onValueChange={mgmtField.onChange} defaultValue={mgmtField.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="member">Member-Managed</SelectItem>
                                              <SelectItem value="manager">Manager-Managed</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </FormItem>
                                      )}
                                    />
                                    {watchedValues.managementType === "manager" && (
                                      <FormField
                                        control={form.control}
                                        name="managerNames"
                                        render={({ field: managerField }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm">Manager Names and Addresses</FormLabel>
                                            <FormControl>
                                              <Textarea
                                                placeholder="List each manager's name and address..."
                                                className="min-h-[80px]"
                                                {...managerField}
                                              />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeEffectiveDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <FormLabel>Include Optional Effective Date</FormLabel>
                                <FormDescription>
                                  Specify a future effective date (up to 60 days). If unchecked, effective date is the approval date.
                                </FormDescription>
                                {field.value && (
                                  <div className="mt-3">
                                    <FormField
                                      control={form.control}
                                      name="effectiveDate"
                                      render={({ field: dateField }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input type="date" {...dateField} />
                                          </FormControl>
                                          <FormDescription className="text-xs">
                                            Must be within 60 days of filing
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeDissolutionDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <FormLabel>Include Optional Dissolution Date</FormLabel>
                                <FormDescription>
                                  Specify a future date for automatic dissolution. If unchecked, LLC has perpetual duration (recommended).
                                </FormDescription>
                                {field.value && (
                                  <div className="mt-3">
                                    <FormField
                                      control={form.control}
                                      name="dissolutionDate"
                                      render={({ field: dateField }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input type="date" {...dateField} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includeLiabilityStatement"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Include Optional Liability/Indemnification Statement</FormLabel>
                                <FormDescription>
                                  Includes indemnification provision for members, managers, agents, and employees.
                                  Most people leave this unchecked and handle indemnification in the Operating Agreement.
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 5: Organizer & Filer Information */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                          <strong>Required Information:</strong> NYS requires organizer and filer information for the Articles of Organization.
                          The organizer and filer can be the same person.
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-primary border-b pb-2">Organizer Information</h3>

                          <FormField
                            control={form.control}
                            name="organizerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organizer Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Legal name of the person forming the LLC
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="organizerAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organizer Street Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormDescription>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:underline text-xs"
                                    onClick={() => {
                                      alert("Address lookup feature coming soon!");
                                    }}
                                  >
                                    🔍 Lookup Address
                                  </button>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="organizerCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Albany" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="organizerState"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="NY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="organizerZip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12207" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-primary">Filer Information</h3>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                form.setValue("filerName", watchedValues.organizerName);
                                form.setValue("filerAddress", watchedValues.organizerAddress);
                                form.setValue("filerCity", watchedValues.organizerCity);
                                form.setValue("filerState", watchedValues.organizerState);
                                form.setValue("filerZip", watchedValues.organizerZip);
                              }}
                            >
                              Copy from Organizer
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name="filerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Filer Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Person submitting this application (can be same as organizer)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="filerEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Filer Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    For order updates
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="filerPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Filer Phone *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="(555) 123-4567"
                                      {...field}
                                      onChange={(e) => {
                                        const formatted = formatPhoneNumber(e.target.value);
                                        field.onChange(formatted);
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    For urgent questions
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="filerAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Filer Street Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormDescription>
                                  <button
                                    type="button"
                                    className="text-blue-600 hover:underline text-xs"
                                    onClick={() => {
                                      alert("Address lookup feature coming soon!");
                                    }}
                                  >
                                    🔍 Lookup Address
                                  </button>
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="filerCity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Albany" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="filerState"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="NY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="filerZip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12207" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                          <h3 className="font-semibold text-primary">Additional Services</h3>

                          <FormField
                            control={form.control}
                            name="addRegisteredAgentService"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 mt-1"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-semibold">
                                    Add Registered Agent Service (+$149/year)
                                  </FormLabel>
                                  <FormDescription>
                                    We&apos;ll accept legal documents and forward them to you promptly. Protects your privacy.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="addBusinessAddress"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="h-4 w-4 mt-1"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-semibold">
                                    Add Virtual Business Address (+$99/month)
                                  </FormLabel>
                                  <FormDescription>
                                    Professional Albany address for your business cards and website
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 6: Review & Submit */}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                          <h3 className="font-display text-2xl font-bold text-primary mb-4">Order Summary</h3>

                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="font-semibold text-primary mb-1">LLC Name</div>
                                <div className="text-gray-700">{watchedValues.llcName}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-primary mb-1">County</div>
                                <div className="text-gray-700">{watchedValues.county}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-primary mb-1">Organizer</div>
                                <div className="text-gray-700">{watchedValues.organizerName}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-primary mb-1">Filer</div>
                                <div className="text-gray-700">{watchedValues.filerName}</div>
                                <div className="text-gray-600 text-xs">{watchedValues.filerEmail}</div>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <div className="font-semibold text-primary mb-2">Optional Provisions Included:</div>
                              <div className="grid md:grid-cols-2 gap-2 text-sm">
                                {watchedValues.includeOpeningStatement && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Opening Statement
                                  </div>
                                )}
                                {watchedValues.includePurposeClause && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Purpose Clause
                                  </div>
                                )}
                                {watchedValues.includeRegisteredAgent && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Registered Agent
                                  </div>
                                )}
                                {watchedValues.includeManagementStructure && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Management Structure ({watchedValues.managementType})
                                  </div>
                                )}
                                {watchedValues.includeEffectiveDate && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Custom Effective Date
                                  </div>
                                )}
                                {watchedValues.includeDissolutionDate && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Dissolution Date
                                  </div>
                                )}
                                {watchedValues.includeLiabilityStatement && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Liability/Indemnification
                                  </div>
                                )}
                                {!watchedValues.includeOpeningStatement &&
                                 !watchedValues.includePurposeClause &&
                                 !watchedValues.includeRegisteredAgent &&
                                 !watchedValues.includeManagementStructure &&
                                 !watchedValues.includeEffectiveDate &&
                                 !watchedValues.includeDissolutionDate &&
                                 !watchedValues.includeLiabilityStatement && (
                                  <div className="text-gray-600 italic">None selected - Using defaults</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">LLC Formation Package</span>
                              <span className="font-semibold">$599</span>
                            </div>
                            <div className="text-xs text-gray-600 pl-4">
                              • Articles of Organization filing<br />
                              • Albany county publication (required)<br />
                              • EIN application assistance<br />
                              • Operating agreement template<br />
                              • Compliance calendar
                            </div>
                            {watchedValues.addRegisteredAgentService && (
                              <div className="flex justify-between items-center border-t pt-3">
                                <span className="text-gray-700">Registered Agent Service</span>
                                <span className="font-semibold">$149/yr</span>
                              </div>
                            )}
                            {watchedValues.addBusinessAddress && (
                              <div className="flex justify-between items-center border-t pt-3">
                                <span className="text-gray-700">Virtual Business Address</span>
                                <span className="font-semibold">$99/mo</span>
                              </div>
                            )}
                            <div className="border-t pt-3 flex justify-between items-center">
                              <span className="font-display text-xl text-primary font-bold">Total</span>
                              <span className="font-display text-3xl font-bold text-primary">
                                ${calculateTotal()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                          <div className="flex gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div className="text-gray-700">
                              <strong>What happens next:</strong> After submission, we&apos;ll prepare your Articles of Organization
                              based on the information provided. You&apos;ll receive a draft for review before we file with NYS.
                              No signatures required from you - we handle the entire process!
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="flex-1"
                        >
                          ← Previous
                        </Button>
                      )}
                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold"
                        >
                          Next Step →
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold text-lg py-6"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Application"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
