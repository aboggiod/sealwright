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
import Header from "@/components/Header";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  agency: z.string().min(1, "Please select an agency"),
  customAgency: z.string().optional(),
  requestDescription: z.string().min(20, "Please provide a detailed description (at least 20 characters)"),
  pricingTier: z.enum(["simple", "complex", "litigation"]),
  urgency: z.enum(["standard", "expedited"]),
});

type PricingTier = {
  id: "simple" | "complex" | "litigation";
  name: string;
  price: number;
  description: string;
  features: string[];
};

const pricingTiers: PricingTier[] = [
  {
    id: "simple",
    name: "Simple Request",
    price: 100,
    description: "Straightforward document requests",
    features: [
      "Single agency request",
      "Well-defined records",
      "Standard processing",
      "Email delivery",
    ],
  },
  {
    id: "complex",
    name: "Complex Request",
    price: 150,
    description: "Multi-agency or detailed requests",
    features: [
      "Multiple agencies",
      "Detailed research required",
      "Follow-up management",
      "Organized delivery",
    ],
  },
  {
    id: "litigation",
    name: "Litigation Support",
    price: 200,
    description: "Legal proceeding documentation",
    features: [
      "Litigation-ready formatting",
      "Certified copies",
      "Chain of custody",
      "Expert consultation",
    ],
  },
];

export default function FOILPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      agency: "",
      customAgency: "",
      requestDescription: "",
      pricingTier: "simple",
      urgency: "standard",
    },
  });

  const selectedTier = form.watch("pricingTier");
  const urgency = form.watch("urgency");
  const agency = form.watch("agency");

  const calculateTotal = () => {
    const tier = pricingTiers.find((t) => t.id === selectedTier);
    let total = tier?.price || 100;
    if (urgency === "expedited") total += 50;
    return total;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const timestamp = new Date().toISOString();
    const orderData = {
      ...values,
      service: "foil",
      total: calculateTotal(),
      timestamp,
    };

    localStorage.setItem(`foil-request-${timestamp}`, JSON.stringify(orderData));

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
              <CardTitle className="text-3xl font-display text-primary">Request Submitted!</CardTitle>
              <CardDescription className="text-lg">
                Your FOIL request has been received and will be processed shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We&apos;ll draft your FOIL request and submit it to the appropriate agency. You&apos;ll receive updates via email.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => setShowSuccess(false)} variant="outline">
                  Submit Another Request
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
          <h1 className="font-display text-5xl font-bold mb-4">FOIL Requests</h1>
          <p className="text-xl text-gray-200">
            Professional Freedom of Information Law document retrieval services
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What is FOIL?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 text-sm">
                <p>
                  The Freedom of Information Law (FOIL) grants public access to government records in New York State.
                </p>
                <p>
                  We handle the entire process: drafting requests, filing with agencies, managing follow-ups, and ensuring you receive complete records.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Pricing Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-3 rounded-lg border-2 ${
                      selectedTier === tier.id ? "border-accent bg-accent/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-primary">{tier.name}</span>
                      <span className="font-display text-xl font-bold text-primary">${tier.price}</span>
                    </div>
                    <p className="text-xs text-gray-600">{tier.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="font-display text-primary">Expedited Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold">+$50 for expedited processing</p>
                  <p>Priority handling with faster turnaround on agency submissions and follow-ups.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Process Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div>
                  <div className="font-semibold text-primary">Step 1: Review (1-2 days)</div>
                  <div className="text-xs">We review and refine your request</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Step 2: Filing (1 day)</div>
                  <div className="text-xs">Submit to appropriate agency</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Step 3: Follow-up (varies)</div>
                  <div className="text-xs">Agency has 5-20 business days to respond</div>
                </div>
                <div>
                  <div className="font-semibold text-primary">Step 4: Delivery</div>
                  <div className="text-xs">We send you the documents</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="md:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-primary">Submit FOIL Request</CardTitle>
                <CardDescription>
                  Provide details about the records you&apos;re seeking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} />
                            </FormControl>
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
                      name="agency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Agency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the agency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dos">NYS Department of State</SelectItem>
                              <SelectItem value="health">NYS Department of Health</SelectItem>
                              <SelectItem value="labor">NYS Department of Labor</SelectItem>
                              <SelectItem value="taxation">NYS Department of Taxation</SelectItem>
                              <SelectItem value="education">NYS Education Department</SelectItem>
                              <SelectItem value="police">NYPD</SelectItem>
                              <SelectItem value="county">County Clerk</SelectItem>
                              <SelectItem value="court">Court System</SelectItem>
                              <SelectItem value="other">Other (specify below)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {agency === "other" && (
                      <FormField
                        control={form.control}
                        name="customAgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specify Agency</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter the specific agency name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="requestDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the records you're seeking in detail. Include dates, names, case numbers, or other identifying information..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be as specific as possible to ensure we retrieve the correct records
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pricingTier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pricingTiers.map((tier) => (
                                <SelectItem key={tier.id} value={tier.id}>
                                  {tier.name} - ${tier.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {pricingTiers.find((t) => t.id === selectedTier)?.description}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Speed</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard Processing (included)</SelectItem>
                              <SelectItem value="expedited">Expedited Processing (+$50)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {pricingTiers.find((t) => t.id === selectedTier)?.name}
                          </span>
                          <span className="font-semibold">
                            ${pricingTiers.find((t) => t.id === selectedTier)?.price}
                          </span>
                        </div>
                        {urgency === "expedited" && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Expedited Processing</span>
                            <span className="font-semibold">$50</span>
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

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit FOIL Request"}
                    </Button>
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
