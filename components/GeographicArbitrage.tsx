import { Card, CardContent } from "@/components/ui/card";

export default function GeographicArbitrage() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/90 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 border border-white rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            The Geographic Arbitrage Advantage
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            We leverage Albany&apos;s lower operating costs to deliver NYC-quality document
            services at a fraction of the price.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Albany Location</h3>
                <p className="text-gray-200">
                  Operating from New York&apos;s capital allows us to maintain lower overhead
                  while staying close to state agencies for faster processing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Same Expertise</h3>
                <p className="text-gray-200">
                  Licensed professionals with years of experience in NYS document processing.
                  You get the same quality without the NYC premium.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-colors">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Massive Savings</h3>
                <p className="text-gray-200">
                  Save 50-75% compared to Manhattan document service providers while
                  receiving the same professional service and results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold mb-2">
                Smart Business, Not Corner-Cutting
              </h3>
              <p className="text-gray-200">
                We pass our lower operating costs directly to you. Same state filings,
                same certifications, same legal validity—just better pricing.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="text-center bg-accent text-primary px-8 py-4 rounded-lg">
                <div className="font-display text-4xl font-bold">50-75%</div>
                <div className="text-sm font-semibold mt-1">LESS THAN NYC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
