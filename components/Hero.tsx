"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-cream py-20 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary mb-4">
          Paper Sherpas
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-4">
          We know the mountain path. The mountain's meaning? No fucking clue.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Professional document filing by SEALWRIGHT, LLC
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/llc-formation">
            <Button className="bg-accent text-primary hover:bg-accent/90 text-lg px-8 py-6">
              Start LLC Formation
            </Button>
          </Link>
          <Link href="#services">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white text-lg px-8 py-6">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
