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
import Link from "next/link";
import Header from "@/components/Header";

const formSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  entityType: z.string().min(1, "Please select entity type"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  currentAddress: z.string().min(10, "Please provide complete address"),
  billingCycle: z.enum(["annual", "monthly"]),
});

export default function RegisteredAgentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      entityType: "",
      contactName: "",
      email: "",
      phone: "",
      currentAddress: "",
      billingCycle: "annual",
    },
  });

  const billingCycle = form.watch("billingCycle");

  const calculatePrice = () => {
    return billingCycle === "annual" ? 149 : 15;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const orderData = {
      ...values,
      service: "registered-agent",
      price: calculatePrice(),
      billingType: billingCycle,
      timestamp,
    };

    localStorage.setItem(`registered-agent-${timestamp}`, JSON.stringify(orderData));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      form.reset();
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
              <CardTitle className="text-3xl font-display text-primary">Welcome Aboard!</CardTitle>
              <CardDescription className="text-lg">
                Your registered agent service registration has been received.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We&apos;ll contact you within 24 hours to finalize setup and provide your secure document portal access.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-semibold text-primary mb-2">Next Steps:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>✓ Invoice will be sent to your email</li>
                  <li>✓ Service begins upon payment</li>
                  <li>✓ Portal credentials in 24 hours</li>
                  <li>✓ File with NYS if needed</li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => setShowSuccess(false)} variant="outline">
                  Register Another Entity
                </Button>
                <Link href="/">
                  <Button>Return Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-accent hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-display text-5xl font-bold mb-4">Registered Agent Service</h1>
          <p className="text-xl text-gray-200">
            Reliable NYS registered agent service for your business
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What is a Registered Agent?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm">
                <p>
                  A registered agent is an individual or business designated to receive legal documents, service of process, and official government correspondence on behalf of your business.
                </p>
                <p>
                  Required by New York State for all LLCs and corporations. Must maintain a physical address in NYS during business hours.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="font-display text-primary">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4">
                  <div className="font-display text-5xl font-bold text-primary mb-2">$75</div>
                  <div className="text-gray-600">per year</div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  Simple, honest pricing. No hidden fees.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Professional Albany office address",
                  "Legal document acceptance",
                  "Immediate email notifications",
                  "Secure online document portal",
                  "Document scanning & forwarding",
                  "Annual compliance reminders",
                  "Privacy protection",
                  "Monday-Friday coverage",
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

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Why Use Our Service?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div>
                  <div className="font-semibold text-primary mb-1">Privacy</div>
                  <div className="text-xs">Keep your home address off public records</div>
                </div>
                <div>
                  <div className="font-semibold text-primary mb-1">Reliability</div>
                  <div className="text-xs">Never miss important legal documents</div>
                </div>
                <div>
                  <div className="font-semibold text-primary mb-1">Compliance</div>
                  <div className="text-xs">Meet NYS requirements effortlessly</div>
                </div>
                <div>
                  <div className="font-semibold text-primary mb-1">Professional Image</div>
                  <div className="text-xs">Capital district business presence</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Signup Form */}
          <div className="md:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-primary">Register Your Business</CardTitle>
                <CardDescription>
                  Sign up for registered agent service today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Example LLC" {...field} />
                          </FormControl>
                          <FormDescription>
                            Legal name as registered with NYS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="entityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entity Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select entity type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                              <SelectItem value="corp">Corporation</SelectItem>
                              <SelectItem value="pllc">Professional LLC (PLLC)</SelectItem>
                              <SelectItem value="pc">Professional Corporation (PC)</SelectItem>
                              <SelectItem value="lp">Limited Partnership (LP)</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="contact@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              For notifications
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
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
                      name="currentAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State ZIP" {...field} />
                          </FormControl>
                          <FormDescription>
                            For our records only
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCycle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Cycle</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="annual">Annual - $149/year (Save $31)</SelectItem>
                              <SelectItem value="monthly">Monthly - $15/month</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Annual billing saves you over 17%
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-display text-xl text-primary">
                          {billingCycle === "annual" ? "Annual" : "Monthly"} Service
                        </span>
                        <div className="text-right">
                          <div className="font-display text-3xl font-bold text-primary">
                            ${calculatePrice()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {billingCycle === "annual" ? "per year" : "per month"}
                          </div>
                        </div>
                      </div>
                      {billingCycle === "annual" && (
                        <div className="text-sm text-accent font-semibold text-center">
                          ✓ You save $31 compared to monthly billing
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                      <div className="flex gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="text-gray-700">
                          <strong>Important:</strong> If you&apos;re changing registered agents, you&apos;ll need to file a form with NYS Department of State. We&apos;ll provide instructions after signup.
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Sign Up Now"}
                    </Button>

                    <p className="text-xs text-center text-gray-600">
                      By signing up, you agree to our terms of service. Service begins upon payment confirmation.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
