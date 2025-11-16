import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const addOnServices = [
  {
    title: "D/B/A Filing",
    price: "$50",
    description: "File a Doing Business As name",
    details: [
      "Certificate of Assumed Name",
      "County clerk filing",
      "Publication arrangement help",
      "Certified copies available"
    ]
  },
  {
    title: "Certificate of Good Standing",
    price: "$75",
    description: "Proof your business is in compliance",
    details: [
      "Official NYS DOS document",
      "Same-day processing available",
      "Multiple certified copies",
      "Digital + physical delivery"
    ]
  },
  {
    title: "Annual Report Filing",
    price: "$100",
    description: "Biennial statement filing service",
    details: [
      "Complete form preparation",
      "Filing with NYS DOS",
      "Confirmation documentation",
      "Compliance calendar update"
    ]
  },
  {
    title: "Apostille Service",
    price: "$99",
    description: "Document authentication for international use",
    details: [
      "First document: $99",
      "Additional docs: $49 each",
      "NYS Department of State certified",
      "All document types accepted"
    ]
  },
  {
    title: "Notary Services",
    price: "$50",
    description: "Professional notarization",
    details: [
      "In-person or mobile",
      "After-hours available",
      "Multi-document packages",
      "Remote online notary (RON)"
    ]
  },
  {
    title: "Document Retrieval",
    price: "$75",
    description: "Get copies of filed documents",
    details: [
      "Articles of Organization",
      "Operating agreements",
      "Filed amendments",
      "Certified copies available"
    ]
  }
];

export default function AddOnsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <div className="bg-primary text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <Link href="/" className="text-accent hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="font-display text-5xl font-bold mb-4">Add-On Services</h1>
            <p className="text-xl text-gray-200">
              Additional business services to keep you compliant and running smooth
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {addOnServices.map((service) => (
              <Card key={service.title} className="border-2 hover:border-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-primary">{service.title}</h3>
                    <div className="price-display text-2xl text-accent">
                      {service.price}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                        <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto border-2 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="text-2xl">Need Something Else?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  If you don&apos;t see what you need, reach out. We handle all kinds of NYS filings and document services.
                </p>
                <a href="mailto:contact@sealwright.com?subject=Additional Services Inquiry">
                  <Button className="bg-accent text-white hover:bg-accent/90">
                    Email Us
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
