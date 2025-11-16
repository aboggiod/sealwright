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
import { NY_COUNTIES, getCountyPublishingCost } from "@/lib/counties";

const formSchema = z.object({
  // Step 1: Business Info
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  businessNameAlt1: z.string().optional(),
  businessNameAlt2: z.string().optional(),
  businessPurpose: z.string().min(10, "Please provide a brief description"),
  county: z.string().min(1, "Please select a county"),

  // Step 2: Member/Organizer Info
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerEmail: z.string().email("Invalid email address"),
  organizerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  organizerStreet: z.string().min(5, "Street address required"),
  organizerCity: z.string().min(2, "City required"),
  organizerState: z.string().min(2, "State required"),
  organizerZip: z.string().min(5, "ZIP code required"),

  // Service of Process Address
  sopName: z.string().min(2, "Name required for service of process"),
  sopStreet: z.string().min(5, "Street address required"),
  sopCity: z.string().min(2, "City required"),
  sopState: z.string().min(2, "State required"),
  sopZip: z.string().min(5, "ZIP code required"),

  // Step 3: Registered Agent Selection
  registeredAgent: z.enum(["paper-sherpas", "none", "other"]),
  otherAgentName: z.string().optional(),
  otherAgentAddress: z.string().optional(),

  // Additional Services
  addBusinessAddress: z.boolean(),
});

export default function LLCFormationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessNameAlt1: "",
      businessNameAlt2: "",
      businessPurpose: "",
      county: "",
      organizerName: "",
      organizerEmail: "",
      organizerPhone: "",
      organizerStreet: "",
      organizerCity: "",
      organizerState: "NY",
      organizerZip: "",
      sopName: "",
      sopStreet: "",
      sopCity: "",
      sopState: "NY",
      sopZip: "",
      registeredAgent: "none",
      otherAgentName: "",
      otherAgentAddress: "",
      addBusinessAddress: false,
    },
  });

  const selectedCounty = form.watch("county");
  const registeredAgent = form.watch("registeredAgent");
  const addBusinessAddress = form.watch("addBusinessAddress");

  const calculateTotal = () => {
    let total = 599; // Base LLC formation
    if (registeredAgent === "paper-sherpas") total += 149;
    if (addBusinessAddress) total += 99;
    return total;
  };

  const getPublishingCost = () => {
    if (!selectedCounty) return 300;
    return getCountyPublishingCost(selectedCounty);
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = [];

    if (currentStep === 1) {
      fieldsToValidate = ["businessName", "businessPurpose", "county"];
    } else if (currentStep === 2) {
      fieldsToValidate = [
        "organizerName",
        "organizerEmail",
        "organizerPhone",
        "organizerStreet",
        "organizerCity",
        "organizerState",
        "organizerZip",
        "sopName",
        "sopStreet",
        "sopCity",
        "sopState",
        "sopZip",
      ];
    } else if (currentStep === 3) {
      if (registeredAgent === "other") {
        fieldsToValidate = ["otherAgentName", "otherAgentAddress"];
      }
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
      basePrice: 599,
      registeredAgentCost: registeredAgent === "paper-sherpas" ? 149 : 0,
      businessAddressCost: addBusinessAddress ? 99 : 0,
      publishingCost: getPublishingCost(),
      total: calculateTotal(),
      timestamp,
    };

    localStorage.setItem(`llc-formation-${timestamp}`, JSON.stringify(orderData));

    // TODO: Generate PDF and send to backend
    // Will implement PDF generation API endpoint

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      form.reset();
      setCurrentStep(1);
    }, 1500);
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-cream py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-accent">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-3xl font-display text-primary">Application Received!</CardTitle>
              <CardDescription className="text-lg">
                Your LLC formation application has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We&apos;ll begin processing your LLC formation and contact you within 24 hours with next steps.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => setShowSuccess(false)} variant="outline">
                  Submit Another Application
                </Button>
                <Link href="/">
                  <Button>Return Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-accent hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-5xl font-bold mb-4">LLC Formation</h1>
          <p className="text-xl text-gray-200">
            Professional business formation at a fraction of NYC prices
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">NYC vs Albany Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Service</th>
                      <th className="text-right py-2">NYC</th>
                      <th className="text-right py-2 text-accent">Albany</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="py-2">State Filing Fee</td>
                      <td className="text-right">$200</td>
                      <td className="text-right font-bold">$200</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Publication</td>
                      <td className="text-right">$1500</td>
                      <td className="text-right font-bold">${getPublishingCost()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Service Fee</td>
                      <td className="text-right">$500</td>
                      <td className="text-right font-bold">$199</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-2">Total</td>
                      <td className="text-right text-lg">$2,200+</td>
                      <td className="text-right text-accent text-xl">${599 + getPublishingCost()}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-display font-bold text-primary">
                    Save ${2200 - (599 + getPublishingCost())}+
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round(((2200 - (599 + getPublishingCost())) / 2200) * 100)}% savings
                  </div>
                </div>
                {selectedCounty && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <div className="text-sm font-semibold text-primary">
                      {selectedCounty} County
                    </div>
                    <div className="text-xs text-gray-600">
                      Est. publication: ${getPublishingCost()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Articles of Organization filing",
                  "County publication arrangement",
                  "EIN application assistance",
                  "Operating agreement template",
                  "Compliance calendar",
                  "Initial consultation",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Multi-step Form */}
          <div className="md:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <CardTitle className="text-3xl font-display text-primary">
                      {currentStep === 1 && "Business Information"}
                      {currentStep === 2 && "Addresses & Contact"}
                      {currentStep === 3 && "Registered Agent"}
                      {currentStep === 4 && "Review & Submit"}
                    </CardTitle>
                    <CardDescription>Step {currentStep} of 4</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step === currentStep
                            ? "bg-accent text-primary"
                            : step < currentStep
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Business Info */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desired Business Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Example LLC" {...field} />
                              </FormControl>
                              <FormDescription>
                                Must end with LLC, L.L.C., or Limited Liability Company
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessNameAlt1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alternative Name 1 (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Backup name if first choice is taken" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="businessNameAlt2"
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

                        <FormField
                          control={form.control}
                          name="businessPurpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Purpose</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Brief description of your business activities..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Describe what your business will do
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County for LLC Office</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[300px]">
                                    {NY_COUNTIES.map((county) => (
                                      <SelectItem key={county.name} value={county.name}>
                                        {county.name} (Est. publication: ${county.publishingCost})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                County determines publication costs - Albany saves you $1,200+
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 2: Addresses */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-display text-xl font-bold text-primary">Organizer Information</h3>

                          <FormField
                            control={form.control}
                            name="organizerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organizer Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full legal name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="organizerEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="organizerPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="(555) 123-4567" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="organizerStreet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-6 gap-4">
                            <FormField
                              control={form.control}
                              name="organizerCity"
                              render={({ field }) => (
                                <FormItem className="col-span-3">
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="organizerState"
                              render={({ field }) => (
                                <FormItem className="col-span-1">
                                  <FormLabel>State</FormLabel>
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
                                <FormItem className="col-span-2">
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12345" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                          <h3 className="font-display text-xl font-bold text-primary">Service of Process Address</h3>
                          <p className="text-sm text-gray-600">
                            Where the Secretary of State will forward legal documents
                          </p>

                          <FormField
                            control={form.control}
                            name="sopName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name or company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="sopStreet"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-6 gap-4">
                            <FormField
                              control={form.control}
                              name="sopCity"
                              render={({ field }) => (
                                <FormItem className="col-span-3">
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sopState"
                              render={({ field }) => (
                                <FormItem className="col-span-1">
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="NY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sopZip"
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12345" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Registered Agent */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-display text-xl font-bold text-primary mb-2">
                            Registered Agent Service
                          </h3>
                          <p className="text-sm text-gray-600 mb-6">
                            A registered agent receives legal documents on behalf of your LLC
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="registeredAgent"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormControl>
                                <div className="space-y-3">
                                  {/* Option 1: Use Paper Sherpas */}
                                  <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                      field.value === "paper-sherpas"
                                        ? "border-accent bg-accent/5"
                                        : "border-gray-200 hover:border-accent/50"
                                    }`}
                                    onClick={() => field.onChange("paper-sherpas")}
                                  >
                                    <div className="flex items-start gap-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "paper-sherpas"}
                                        onChange={() => field.onChange("paper-sherpas")}
                                        className="mt-1 h-4 w-4"
                                      />
                                      <div className="flex-1">
                                        <div className="font-semibold text-primary flex items-center gap-2">
                                          Use Paper Sherpas as Your Registered Agent
                                          <span className="text-sm font-normal text-accent">
                                            +$149/year
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          Professional registered agent service with Albany office address, email
                                          notifications, and secure document portal
                                        </p>
                                        <div className="mt-2 space-y-1">
                                          {[
                                            "Albany office address",
                                            "Email & SMS notifications",
                                            "Secure online document access",
                                            "No surprise fees",
                                          ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                              <svg
                                                className="w-4 h-4 text-accent flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              {item}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Option 2: No Registered Agent */}
                                  <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                      field.value === "none"
                                        ? "border-accent bg-accent/5"
                                        : "border-gray-200 hover:border-accent/50"
                                    }`}
                                    onClick={() => field.onChange("none")}
                                  >
                                    <div className="flex items-start gap-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "none"}
                                        onChange={() => field.onChange("none")}
                                        className="mt-1 h-4 w-4"
                                      />
                                      <div className="flex-1">
                                        <div className="font-semibold text-primary">No Registered Agent</div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          You&apos;ll receive service of process documents directly at the address you
                                          provided above
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Option 3: Other Registered Agent */}
                                  <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                      field.value === "other"
                                        ? "border-accent bg-accent/5"
                                        : "border-gray-200 hover:border-accent/50"
                                    }`}
                                    onClick={() => field.onChange("other")}
                                  >
                                    <div className="flex items-start gap-3">
                                      <input
                                        type="radio"
                                        checked={field.value === "other"}
                                        onChange={() => field.onChange("other")}
                                        className="mt-1 h-4 w-4"
                                      />
                                      <div className="flex-1">
                                        <div className="font-semibold text-primary">
                                          Other Registered Agent
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                          You already have a registered agent service
                                        </p>

                                        {field.value === "other" && (
                                          <div className="mt-4 space-y-3">
                                            <FormField
                                              control={form.control}
                                              name="otherAgentName"
                                              render={({ field: agentField }) => (
                                                <FormItem>
                                                  <FormLabel className="text-sm">
                                                    Registered Agent Name
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="Agent name or company"
                                                      {...agentField}
                                                      onClick={(e) => e.stopPropagation()}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                            <FormField
                                              control={form.control}
                                              name="otherAgentAddress"
                                              render={({ field: addressField }) => (
                                                <FormItem>
                                                  <FormLabel className="text-sm">
                                                    Registered Agent Address
                                                  </FormLabel>
                                                  <FormControl>
                                                    <Input
                                                      placeholder="Full NYS address"
                                                      {...addressField}
                                                      onClick={(e) => e.stopPropagation()}
                                                    />
                                                  </FormControl>
                                                  <FormMessage />
                                                </FormItem>
                                              )}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="border-t pt-6">
                          <h3 className="font-display text-lg font-bold text-primary mb-4">
                            Additional Services
                          </h3>

                          <FormField
                            control={form.control}
                            name="addBusinessAddress"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border-2 p-4">
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

                    {/* Step 4: Review & Submit */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                          <h3 className="font-display text-xl font-bold text-primary mb-4">
                            Order Summary
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b">
                              <div>
                                <div className="font-semibold text-primary">LLC Formation Service</div>
                                <div className="text-sm text-gray-600">
                                  Filing, publication setup, documents & support
                                </div>
                              </div>
                              <span className="font-semibold text-lg">$599</span>
                            </div>

                            {selectedCounty && (
                              <div className="flex justify-between items-center pb-3 border-b text-sm">
                                <div>
                                  <div className="font-medium text-gray-700">
                                    Publication in {selectedCounty} County
                                  </div>
                                  <div className="text-xs text-gray-500">Estimated cost</div>
                                </div>
                                <span className="font-semibold">${getPublishingCost()}</span>
                              </div>
                            )}

                            {registeredAgent === "paper-sherpas" && (
                              <div className="flex justify-between items-center pb-3 border-b text-sm">
                                <span className="text-gray-700">Registered Agent Service (annual)</span>
                                <span className="font-semibold">$149</span>
                              </div>
                            )}

                            {addBusinessAddress && (
                              <div className="flex justify-between items-center pb-3 border-b text-sm">
                                <span className="text-gray-700">Virtual Business Address (monthly)</span>
                                <span className="font-semibold">$99</span>
                              </div>
                            )}

                            <div className="border-t-2 pt-4 flex justify-between items-center">
                              <span className="font-display text-xl text-primary font-bold">
                                Total Service Fee
                              </span>
                              <span className="font-display text-3xl font-bold text-primary">
                                ${calculateTotal()}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 pt-2">
                              * State filing fee ($200) and publication costs are additional and paid directly to
                              government/newspapers
                            </div>
                          </div>
                        </div>

                        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                          <h4 className="font-semibold text-primary mb-2">What Happens Next?</h4>
                          <ol className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2">
                              <span className="font-bold">1.</span>
                              <span>We&apos;ll review your application and contact you within 24 hours</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold">2.</span>
                              <span>We&apos;ll verify business name availability with NYS</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold">3.</span>
                              <span>You&apos;ll receive payment instructions for state fees</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold">4.</span>
                              <span>We&apos;ll file your Articles of Organization with NYS</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold">5.</span>
                              <span>We&apos;ll arrange publication and handle all compliance requirements</span>
                            </li>
                          </ol>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(currentStep - 1)}
                          className="flex-1"
                        >
                          Previous
                        </Button>
                      )}
                      {currentStep < 4 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold"
                        >
                          Next Step
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1 bg-accent hover:bg-accent/90 text-primary font-semibold"
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
