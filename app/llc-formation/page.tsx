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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Header from "@/components/Header";

const packages = [
  {
    name: "basic",
    title: "Basic DIY",
    price: 249,
    description: "You're DIY-savvy and just need someone who knows where the forms go. We'll take your Articles of Organization and file them same-day. You save money, we save time, everyone's happy.",
    features: [
      "You provide Articles of Organization",
      "We file with NYS DOS",
      "FREE EIN assistance",
      "Email confirmation"
    ]
  },
  {
    name: "premium",
    title: "Premium",
    price: 399,
    description: "You want this done right without thinking about it. We draft your Articles, you sign digitally on our site, we file everything including your free EIN. Wake up tomorrow with an LLC.",
    features: [
      "We prepare Articles of Organization",
      "Digital signature",
      "FREE EIN filing",
      "1 year Registered Agent included"
    ]
  },
  {
    name: "full",
    title: "Full Service",
    price: 699,
    description: "White glove treatment. We handle everything for 2 years - formation, EIN, registered agent, biennial statement, even a free DBA. You literally do nothing except sign once and collect your documents.",
    features: [
      "Everything in Premium",
      "2 years Registered Agent",
      "Biennial statement filing",
      "FREE D/B/A filing"
    ]
  }
];

const formSchema = z.object({
  selectedPackage: z.enum(["basic", "premium", "full"]),
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  businessNameAlt1: z.string().optional(),
  businessNameAlt2: z.string().optional(),
  businessPurpose: z.string().min(10, "Please provide a brief description"),
  memberName: z.string().min(2, "Member name is required"),
  memberEmail: z.string().email("Invalid email address"),
  memberPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  memberAddress: z.string().min(10, "Complete address required"),
  memberCity: z.string().min(2, "City is required"),
  memberState: z.string().min(2, "State is required"),
  memberZip: z.string().min(5, "ZIP code is required"),
});

export default function LLCFormationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPackage: "premium",
      businessName: "",
      businessNameAlt1: "",
      businessNameAlt2: "",
      businessPurpose: "",
      memberName: "",
      memberEmail: "",
      memberPhone: "",
      memberAddress: "",
      memberCity: "",
      memberState: "NY",
      memberZip: "",
    },
  });

  const selectedPackage = form.watch("selectedPackage");

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = [];

    if (currentStep === 1) {
      fieldsToValidate = ["selectedPackage"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["businessName", "businessPurpose"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["memberName", "memberEmail", "memberPhone", "memberAddress", "memberCity", "memberState", "memberZip"];
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
      <>
        <Header />
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
                    <Button className="bg-accent text-white hover:bg-accent/90">Return Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  const selectedPkg = packages.find(p => p.name === selectedPackage);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <div className="bg-primary text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link href="/" className="text-accent hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">LLC Formation</h1>
            <p className="text-lg text-gray-200">
              Three simple steps to form your New York LLC
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl py-8 px-4">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === currentStep ? "bg-accent text-white" :
                    step < currentStep ? "bg-primary text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Package</span>
              <span>Business</span>
              <span>Member Info</span>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-display text-primary">
                {currentStep === 1 && "Choose Your Package"}
                {currentStep === 2 && "Business Information"}
                {currentStep === 3 && "Member Information"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Select the service level that fits your needs"}
                {currentStep === 2 && "Tell us about your business"}
                {currentStep === 3 && "Primary member contact information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  {/* STEP 1: Package Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="selectedPackage"
                        render={({ field }) => (
                          <FormItem>
                            <div className="grid gap-4">
                              {packages.map((pkg) => (
                                <div
                                  key={pkg.name}
                                  onClick={() => field.onChange(pkg.name)}
                                  className={`cursor-pointer border-2 rounded-lg p-5 transition-all ${
                                    field.value === pkg.name
                                      ? "border-accent bg-accent/5 shadow-md"
                                      : "border-gray-200 hover:border-accent/50 hover:shadow"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className="font-display text-xl font-bold text-primary">{pkg.title}</h3>
                                      <p className="text-gray-600 text-sm">{pkg.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-accent">
                                        <span className="price-display text-3xl">${pkg.price}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <ul className="space-y-1.5">
                                    {pkg.features.map((feature, idx) => (
                                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                        <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 2: Business Info */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Desired Business Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Example LLC" {...field} className="text-base" />
                            </FormControl>
                            <FormDescription className="text-xs">
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
                              <Input placeholder="Backup if first choice unavailable" {...field} />
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
                            <FormLabel className="text-base font-semibold">Business Purpose *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what your business will do..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              Brief description of your business activities
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* STEP 3: Member Info */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="memberName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Primary Member Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
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
                              <FormLabel className="text-base font-semibold">Email *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
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
                              <FormLabel className="text-base font-semibold">Phone *</FormLabel>
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
                            <FormLabel className="text-base font-semibold">Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs">
                              This will be listed in public records
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="memberCity"
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
                          name="memberState"
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
                          name="memberZip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP *</FormLabel>
                              <FormControl>
                                <Input placeholder="12207" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Summary */}
                      <div className="mt-6 p-4 bg-accent/5 rounded-lg border-2 border-accent/20">
                        <div className="font-semibold text-primary mb-2">Order Summary</div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">{selectedPkg?.title} Package</span>
                          <span className="price-display text-2xl text-accent">
                            ${selectedPkg?.price}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Includes FREE EIN filing assistance</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 pt-4">
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
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold"
                      >
                        Continue →
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold"
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

          {/* Info below form */}
          {currentStep === 1 && (
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>All packages include FREE EIN filing assistance</p>
              <p className="mt-2">Questions? <a href="mailto:contact@sealwright.com" className="text-accent hover:underline">Contact us</a></p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
