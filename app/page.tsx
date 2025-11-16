import Hero from "@/components/Hero";
import TrustSignals from "@/components/TrustSignals";
import Services from "@/components/Services";
import GeographicArbitrage from "@/components/GeographicArbitrage";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <TrustSignals />
      <Services />
      <GeographicArbitrage />
      <Footer />
    </main>
  );
}
