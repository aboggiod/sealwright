import LayoutWrapper from "@/components/LayoutWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const addOnServices = [
  {
    title: "Biennial Statement",
    price: "$50",
    description: "Required bi-annual filing to maintain LLC in good standing",
    features: [
      "Complete form preparation",
      "Filing with NYS Department of State",
      "Confirmation of filing",
      "Deadline tracking reminder"
    ]
  },
  {
    title: "D/B/A Filing",
    price: "County fee + $25",
    description: "\"Doing Business As\" name registration with county clerk",
    features: [
      "County clerk filing",
      "Certificate retrieval",
      "Publication arrangement (if required)",
      "Legal name verification"
    ]
  },
  {
    title: "Certificate of Good Standing",
    price: "$50",
    description: "Official document proving your LLC is in good standing",
    features: [
      "NYS Department of State certified",
      "Same-day processing available",
      "Digital and physical copies",
      "Required for loans and contracts"
    ]
  },
  {
    title: "Solo EIN",
    price: "$20",
    description: "Employer Identification Number application service",
    features: [
      "IRS Form SS-4 preparation",
      "Electronic filing",
      "Same-day EIN delivery",
      "Confirmation letter"
    ]
  },
  {
    title: "Articles of Amendment",
    price: "$100",
    description: "Modify your LLC's articles of organization",
    features: [
      "Amendment drafting",
      "NYS filing included",
      "Name changes, address updates, etc.",
      "Certificate of amendment"
    ]
  },
  {
    title: "Apostille Service",
    price: "$99",
    description: "State-certified authentication for international document use",
    features: [
      "Same-day processing available",
      "All document types accepted",
      "NYS Department of State certified",
      "Mail-in or drop-off service"
    ]
  }
];

export default function AddOnsPage() {
  return (
    <LayoutWrapper>
      <div className="bg-cream">
        {/* Page Header */}
        <div className="bg-primary text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="font-display text-5xl font-bold mb-4">Add-On Services</h1>
            <p className="text-xl text-gray-200">
              Additional document services to support your business needs
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="mb-8">
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              Enhance your core services with our competitively priced add-ons. All services include
              professional preparation and filing assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnServices.map((service, index) => (
              <Card key={index} className="border-2 hover:border-accent transition-colors duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-display text-primary">
                      {service.title}
                    </CardTitle>
                  </div>
                  <div className="font-display text-3xl font-bold text-accent mb-2">
                    {service.price}
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center bg-primary/5 border-2 border-primary/20 rounded-lg p-8">
            <h3 className="font-display text-2xl font-bold text-primary mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Not sure which services you need? Contact us for a free consultation to discuss your
              business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:contact@sealwright.com">
                <Button className="bg-accent hover:bg-accent/90 text-primary font-semibold">
                  Email Us
                </Button>
              </a>
              <a href="tel:5185550100">
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold">
                  Call (518) 555-0100
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
