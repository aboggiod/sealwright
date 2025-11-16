import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
  {
    title: "LLC Formation",
    price: "From $249",
    description: "Complete business formation with EIN included FREE",
    link: "/llc-formation",
    features: [
      "Basic DIY: $249",
      "Premium Full Service: $399",
      "White Glove Package: $699",
      "FREE EIN with all packages"
    ]
  },
  {
    title: "FOIL Requests",
    price: "From $100",
    description: "We know which desk, which clerk, which form",
    link: "/foil",
    features: [
      "Simple requests: $100",
      "Complex requests: $150",
      "Litigation support: $200",
      "Appeal assistance included"
    ]
  },
  {
    title: "Registered Agent",
    price: "$75/year",
    description: "Real Albany address, real human beings",
    link: "/registered-agent",
    features: [
      "State Street address",
      "Document scanning",
      "Email alerts",
      "No bullshit fees"
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="bg-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-primary mb-4">
            Three Services. No Bullshit.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.title} href={service.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="price-display text-xl text-accent">
                    {service.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/add-ons">
            <Button variant="link" className="text-primary">
              Need something else? View all add-on services →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
