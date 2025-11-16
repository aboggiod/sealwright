"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-primary text-white py-4 px-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-2xl font-bold hover:text-accent transition-colors">
            Sealwright <span className="text-accent">LLC</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/llc-formation" className="hover:text-accent transition-colors">
              LLC Formation
            </Link>
            <Link href="/foil" className="hover:text-accent transition-colors">
              FOIL Requests
            </Link>
            <Link href="/registered-agent" className="hover:text-accent transition-colors">
              Registered Agent
            </Link>
            <Link href="/add-ons" className="hover:text-accent transition-colors">
              Add-ons
            </Link>
          </nav>

          <Link href="/llc-formation">
            <Button className="bg-accent text-white hover:bg-accent/90 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
