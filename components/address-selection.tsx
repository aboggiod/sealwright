"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AddressSelectionProps {
  onSelect: (choice: "own" | "sealwright") => void;
  onBack?: () => void;
}

export default function AddressSelection({ onSelect, onBack }: AddressSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-display text-3xl font-bold text-primary">
          Choose Your Registered Office Address
        </h2>
        <p className="text-gray-600">
          Every LLC needs a registered office address for official correspondence
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Use Own Address */}
        <Card
          className="border-2 hover:border-primary/30 transition-all cursor-pointer group"
          onClick={() => onSelect("own")}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-display text-primary group-hover:text-accent transition-colors">
              Use My Own Address
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-accent">
              FREE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Use your home or business address as your registered office.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">No additional cost</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Complete control</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Address will be public record</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Must be available during business hours</span>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("own");
              }}
            >
              Use My Address
            </Button>
          </CardContent>
        </Card>

        {/* Use Sealwright Address */}
        <Card
          className="border-2 border-accent/50 hover:border-accent transition-all cursor-pointer group relative"
          onClick={() => onSelect("sealwright")}
        >
          <div className="absolute top-4 right-4 bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-primary group-hover:text-accent transition-colors">
              Use Sealwright Address
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-accent">
              $75/year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Professional Albany address keeps your home address private.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Keep home address private</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Professional Albany location</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Mail forwarding included</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">We handle official correspondence</span>
              </div>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("sealwright");
              }}
            >
              Use Sealwright Address
            </Button>
          </CardContent>
        </Card>
      </div>

      {onBack && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onBack}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
}
