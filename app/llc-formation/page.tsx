"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
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
import AddressSelection from "@/components/address-selection";
import SignatureCanvas from "react-signature-canvas";
import { Check } from "lucide-react";

type PackageType = "basic" | "premium" | "full" | null;

const formSchema = z.object({
  // Step 1: Business Info
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  businessNameAlt1: z.string().optional(),
  businessNameAlt2: z.string().optional(),
  businessPurpose: z.string().min(10, "Please provide a brief description"),

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(null);
  const [selectedAddress, setSelectedAddress] = useState<"own" | "sealwright" | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessNameAlt1: "",
      businessNameAlt2: "",
      businessPurpose: "",
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

  const getPackagePrice = () => {
    if (selectedPackage === "basic") return 249;
    if (selectedPackage === "premium") return 399;
    if (selectedPackage === "full") return 699;
    return 0;
  };

  const calculateTotal = () => {
    let total = getPackagePrice();
    if (selectedAddress === "sealwright") total += 75; // Sealwright address
    if (addRegisteredAgent) total += 149;
    if (addBusinessAddress) total += 99;
    return total;
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof z.infer<typeof formSchema>> = [];

    if (currentStep === 3) {
      fieldsToValidate = ["businessName", "businessPurpose"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["memberName", "memberEmail", "memberPhone", "memberAddress"];
    }

    const isValid = fieldsToValidate.length === 0 || await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePackageSelect = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setCurrentStep(1); // Move to address selection
  };

  const handleAddressSelect = (choice: "own" | "sealwright") => {
    setSelectedAddress(choice);
    setCurrentStep(2); // Move to business info step
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const orderData = {
      ...values,
      selectedAddress,
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
                      {currentStep === 0 && "Choose Your Package"}
                      {currentStep === 1 && "Address Selection"}
                      {currentStep === 2 && "Business Information"}
                      {currentStep === 3 && "Member Information"}
                      {currentStep === 4 && (selectedPackage === "basic" ? "Upload Documents" : "Sign Documents")}
                      {currentStep === 5 && "Review & Payment"}
                    </CardTitle>
                    <CardDescription>Step {currentStep + 1} of 6</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((step) => (
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
                        {step + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Step 0: Package Selection */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-display text-primary mb-2">
                        Choose Your LLC Formation Package
                      </h3>
                      <p className="text-gray-600">
                        Select the package that best fits your needs
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Basic Package */}
                      <Card
                        className="border-2 hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => handlePackageSelect("basic")}
                      >
                        <CardHeader>
                          <CardTitle className="text-2xl font-display text-primary">
                            Basic
                          </CardTitle>
                          <CardDescription className="text-3xl font-bold text-accent">
                            $249
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Perfect for DIY entrepreneurs who want to handle their own documents
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>You prepare your own documents</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>We file with NYS DOS</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Publication in Albany</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect("basic");
                          }}>
                            Select Basic
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Premium Package */}
                      <Card
                        className="border-2 border-accent/50 hover:border-accent transition-all cursor-pointer group relative"
                        onClick={() => handlePackageSelect("premium")}
                      >
                        <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
                          POPULAR
                        </div>
                        <CardHeader>
                          <CardTitle className="text-2xl font-display text-primary">
                            Premium
                          </CardTitle>
                          <CardDescription className="text-3xl font-bold text-accent">
                            $399
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 mb-4">
                            We prepare your documents - you just sign digitally
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>We prepare all documents</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Digital signature capture</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Filing & publication</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Operating agreement template</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-primary" onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect("premium");
                          }}>
                            Select Premium
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Full Service Package */}
                      <Card
                        className="border-2 border-primary hover:border-primary/70 transition-all cursor-pointer group"
                        onClick={() => handlePackageSelect("full")}
                      >
                        <CardHeader>
                          <CardTitle className="text-2xl font-display text-primary">
                            Full Service
                          </CardTitle>
                          <CardDescription className="text-3xl font-bold text-accent">
                            $699
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 mb-4">
                            Complete white-glove service with EIN and everything
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Everything in Premium</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>EIN application with IRS</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Custom operating agreement</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>30-min consultation</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white" onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect("full");
                          }}>
                            Select Full Service
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Step 1: Address Selection */}
                {currentStep === 1 && (
                  <AddressSelection
                    onSelect={handleAddressSelect}
                  />
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 2: Business Info */}
                    {currentStep === 2 && (
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
                      </div>
                    )}

                    {/* Step 3: Member Info */}
                    {currentStep === 3 && (
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

                    {/* Step 4: Signature/Upload */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        {selectedPackage === "basic" ? (
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-primary">
                              Upload Your Documents
                            </h3>
                            <p className="text-gray-600">
                              Please upload your completed Articles of Organization
                            </p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                              >
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-gray-600">
                                  {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                                </span>
                                <span className="text-sm text-gray-500">PDF, DOC, or DOCX</span>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-primary">
                              Sign Your Documents
                            </h3>
                            <p className="text-gray-600">
                              Please sign below to authorize the filing
                            </p>
                            <div className="border-2 border-gray-300 rounded-lg">
                              <SignatureCanvas
                                ref={signatureRef}
                                canvasProps={{
                                  width: 500,
                                  height: 200,
                                  className: 'signature-canvas',
                                  style: { width: '500px', height: '200px' }
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={clearSignature}
                              className="mt-2"
                            >
                              Clear Signature
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 5: Review & Payment */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-primary">
                          Review Your Order
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700">Package</h4>
                            <p className="text-gray-600 capitalize">{selectedPackage}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700">Business Name</h4>
                            <p className="text-gray-600">{form.getValues("businessName")}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700">Address Option</h4>
                            <p className="text-gray-600">{selectedAddress === "sealwright" ? "Sealwright Address" : "Own Address"}</p>
                          </div>
                        </div>

                        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">{selectedPackage?.charAt(0).toUpperCase() + selectedPackage?.slice(1)} Package</span>
                              <span className="font-semibold">${getPackagePrice()}</span>
                            </div>
                            {selectedAddress === "sealwright" && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Sealwright Address</span>
                                <span className="font-semibold">$75</span>
                              </div>
                            )}
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

                    {currentStep > 1 && (
                      <div className="flex gap-4">
                        {currentStep > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="flex-1"
                          >
                            Previous
                          </Button>
                        )}
                        {currentStep < 5 ? (
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
                    )}
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
