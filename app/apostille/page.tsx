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
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  documentType: z.string().min(1, "Please select a document type"),
  quantity: z.number().min(1, "Quantity must be at least 1").max(50, "Maximum 50 documents per order"),
  returnAddress: z.string().min(10, "Please provide a complete return address"),
  specialInstructions: z.string().optional(),
});

export default function ApostillePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      documentType: "",
      quantity: 1,
      returnAddress: "",
      specialInstructions: "",
    },
  });

  const quantity = form.watch("quantity") || 1;
  const calculateTotal = () => {
    if (quantity === 1) return 99;
    return 99 + (quantity - 1) * 49;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Save to localStorage
    const timestamp = new Date().toISOString();
    const orderData = {
      ...values,
      service: "apostille",
      total: calculateTotal(),
      timestamp,
    };

    localStorage.setItem(`apostille-order-${timestamp}`, JSON.stringify(orderData));

    // Simulate API call
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
              <CardTitle className="text-3xl font-display text-primary">Order Received!</CardTitle>
              <CardDescription className="text-lg">
                Thank you for your apostille order. We&apos;ll contact you shortly with mailing instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                A confirmation email has been sent to your email address with next steps.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => setShowSuccess(false)} variant="outline">
                  Submit Another Order
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
          <h1 className="font-display text-5xl font-bold mb-4">Apostille Services</h1>
          <p className="text-xl text-gray-200">
            State-certified document authentication for international use
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Section */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">What is an Apostille?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>
                  An apostille is an official certification that authenticates the origin of a public document for use in foreign countries.
                </p>
                <p>
                  Required for documents like birth certificates, diplomas, and court records to be recognized internationally.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">First Document</span>
                  <span className="font-bold text-2xl text-primary">$99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Additional Docs</span>
                  <span className="font-bold text-xl text-primary">$49 each</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-primary">Process Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-semibold text-primary">Mail Documents</div>
                      <div className="text-sm text-gray-600">Send originals to our Albany office</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-semibold text-primary">Processing</div>
                      <div className="text-sm text-gray-600">1-2 business days (same-day available)</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-semibold text-primary">Return Shipment</div>
                      <div className="text-sm text-gray-600">Secure return via your preferred method</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Form */}
          <div className="md:col-span-2">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-primary">Place Your Order</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll send you mailing instructions
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="documentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select document type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
                                <SelectItem value="marriage-certificate">Marriage Certificate</SelectItem>
                                <SelectItem value="divorce-decree">Divorce Decree</SelectItem>
                                <SelectItem value="diploma">Diploma</SelectItem>
                                <SelectItem value="transcript">Transcript</SelectItem>
                                <SelectItem value="court-order">Court Order</SelectItem>
                                <SelectItem value="corporate-docs">Corporate Documents</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="50"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormDescription>
                              Number of documents to apostille
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="returnAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return Mailing Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St, City, State ZIP" {...field} />
                          </FormControl>
                          <FormDescription>
                            Where should we mail your apostilled documents?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Any special handling requirements..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="text-lg font-semibold">${calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{quantity} document{quantity > 1 ? 's' : ''}</span>
                        <span>
                          {quantity === 1 ? '$99' : `$99 + ${quantity - 1} × $49`}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Order"}
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
