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
import LayoutWrapper from "@/components/LayoutWrapper";

const formSchema = z.object({
  // Step 1: Business Info
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  businessNameAlt1: z.string().optional(),
  businessNameAlt2: z.string().optional(),
  businessPurpose: z.string().min(10, "Please provide a brief description"),
  county: z.string().min(1, "County is required"),

  // Step 2: Member Info
  memberName: z.string().min(2, "Member name is required"),
  memberEmail: z.string().email("Invalid email address"),
  memberPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  memberAddress: z.string().min(10, "Complete address required"),

  // Step 3: Service Selection
  registeredAddress: z.enum(["own", "sealwright"]),
  addRegisteredAgent: z.boolean(),
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
      memberName: "",
      memberEmail: "",
      memberPhone: "",
      memberAddress: "",
      registeredAddress: "own",
      addRegisteredAgent: false,
      addBusinessAddress: false,
    },
  });

  const addRegisteredAgent = form.watch("addRegisteredAgent");
  const addBusinessAddress = form.watch("addBusinessAddress");

  const calculateTotal = () => {
    let total = 599; // Base LLC formation
    if (addRegisteredAgent) total += 149;
    if (addBusinessAddress) total += 99;
    return total;
  };

  const nextStep = async () => {
    const stepFields: Record<number, Array<keyof z.infer<typeof formSchema>>> = {
      1: ["businessName", "businessPurpose", "county"],
      2: ["memberName", "memberEmail", "memberPhone"],
      3: [], // No validation for service selection step
    };

    const fieldsToValidate = stepFields[currentStep];
    if (fieldsToValidate && fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) {
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
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

    localStorage.setItem(`llc-formation-${timestamp}`, JSON.stringify(orderData));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      form.reset();
      setCurrentStep(1);
    }, 1500);
  }

  if (showSuccess) {
    return (
      <LayoutWrapper>
        <div className="bg-cream py-12 px-4">
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
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="bg-cream">
        {/* Page Header */}
        <div className="bg-primary text-white py-16 px-4">
          <div className="container mx-auto max-w-4xl">
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
                      <td className="py-2">Filing</td>
                      <td className="text-right">$500</td>
                      <td className="text-right font-bold">$200</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Publication</td>
                      <td className="text-right">$1500</td>
                      <td className="text-right font-bold">$200</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Service Fee</td>
                      <td className="text-right">$500</td>
                      <td className="text-right font-bold">$199</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="py-2">Total</td>
                      <td className="text-right text-lg">$2,500</td>
                      <td className="text-right text-accent text-xl">$599</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 text-center">
                  <div className="text-2xl font-display font-bold text-primary">
                    Save $1,901
                  </div>
                  <div className="text-sm text-gray-600">76% savings</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Articles of Organization filing",
                  "Albany publication (required)",
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

            <Card className="bg-accent/5 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="font-display text-primary">Optional Add-ons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Registered Agent</span>
                  <span className="font-bold text-primary">+$149/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Business Address</span>
                  <span className="font-bold text-primary">+$99/mo</span>
                </div>
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
                      {currentStep === 2 && "Member Information"}
                      {currentStep === 3 && "Additional Services"}
                    </CardTitle>
                    <CardDescription>Step {currentStep} of 3</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((step) => (
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
                              <FormLabel>County</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Albany">Albany County</SelectItem>
                                  <SelectItem value="Bronx">Bronx County</SelectItem>
                                  <SelectItem value="Kings">Kings County (Brooklyn)</SelectItem>
                                  <SelectItem value="New York">New York County (Manhattan)</SelectItem>
                                  <SelectItem value="Queens">Queens County</SelectItem>
                                  <SelectItem value="Richmond">Richmond County (Staten Island)</SelectItem>
                                  <SelectItem value="Erie">Erie County</SelectItem>
                                  <SelectItem value="Monroe">Monroe County</SelectItem>
                                  <SelectItem value="Nassau">Nassau County</SelectItem>
                                  <SelectItem value="Suffolk">Suffolk County</SelectItem>
                                  <SelectItem value="Westchester">Westchester County</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                County where LLC will be formed
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 2: Member Info */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="memberName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Member Name</FormLabel>
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
                            name="memberEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="member@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="memberPhone"
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
                          name="memberAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Member Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, City, State ZIP" {...field} />
                              </FormControl>
                              <FormDescription>
                                This will be listed in public records
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 3: Services */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="registeredAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registered Office Address</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="own">Use my own address (free)</SelectItem>
                                    <SelectItem value="sealwright">Use Sealwright address ($49/yr)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Required address for official correspondence
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="addRegisteredAgent"
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
                                  We&apos;ll accept legal documents and forward them to you promptly
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

                        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">LLC Formation</span>
                              <span className="font-semibold">$599</span>
                            </div>
                            {addRegisteredAgent && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Registered Agent</span>
                                <span className="font-semibold">$149</span>
                              </div>
                            )}
                            {addBusinessAddress && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Business Address</span>
                                <span className="font-semibold">$99</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between items-center">
                              <span className="font-display text-lg text-primary">Total</span>
                              <span className="font-display text-2xl font-bold text-primary">
                                ${calculateTotal()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
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
                      {currentStep < 3 ? (
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
    </LayoutWrapper>
  );
}
