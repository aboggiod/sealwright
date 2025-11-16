'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Shield } from 'lucide-react';

interface AddressSelectionProps {
  onSelect: (choice: "own" | "sealwright") => void;
  onBack?: () => void;
}

export default function AddressSelection({ onSelect, onBack }: AddressSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display text-primary mb-2">
          Great! Let&apos;s Keep Moving 🚀
        </h2>
        <p className="text-xl text-gray-700">
          Next Step: Where Should We Register Your Business?
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-gray-600">
            <strong>NYS DOS Requirement:</strong> Every LLC must maintain a New York street address
            (not a P.O. Box) where legal documents can be served. This becomes public record.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <span className="text-2xl mr-3">👻</span>
          <div className="text-sm text-gray-700">
            <p className="font-bold mb-2">About Those &quot;Monsters&quot;...</p>
            <p>We&apos;re being playful! Using your own address is totally safe and legal.
            The &quot;scary monsters&quot; are just our metaphor for some real considerations:</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Own Address Option */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelect('own')}>
          <CardHeader>
            <div className="absolute top-4 right-4 text-3xl">👻</div>
            <Home className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <CardTitle>Use My Own Address</CardTitle>
            <CardDescription>FREE (with considerations)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-orange-800">Real Considerations:</p>
              <ul className="space-y-1">
                <li>• <strong>Privacy A:</strong> Address becomes searchable public record</li>
                <li>• <strong>Privacy B:</strong> Anyone can find where you live</li>
                <li>• <strong>Legal:</strong> Process servers may show up at your door</li>
                <li>• <strong>Professional:</strong> Home address may not inspire confidence</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sealwright Address Option */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500"
              onClick={() => onSelect('sealwright')}>
          <CardHeader>
            <div className="absolute top-4 right-4 text-3xl">🛡️</div>
            <div className="absolute top-4 left-4">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">RECOMMENDED</span>
            </div>
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle>Use Sealwright&apos;s Address</CardTitle>
            <CardDescription className="text-accent font-bold">$75/year or $7.50/month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-green-800">Monster-Free Benefits:</p>
              <ul className="space-y-1">
                <li>✓ Your home stays private</li>
                <li>✓ Professional State Street address</li>
                <li>✓ We handle service of process</li>
                <li>✓ Separate business & personal mail</li>
                <li>✓ Move without updating LLC</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <p className="text-center">
          <span className="text-2xl">⚠️ ⚖️ ⚠️</span><br/>
          <strong className="text-red-800 text-lg">THIS IS NOT LEGAL ADVICE!</strong><br/>
          <span className="text-sm text-gray-700">
            We&apos;re a document filing service, not lawyers. Every situation is unique.
            If unsure, consult an attorney or tax professional.
          </span>
        </p>
      </div>

      {/* Ghostbusters joke OUTSIDE legal disclaimer */}
      <p className="text-center text-sm text-gray-500 italic">
        (For actual ghosts, call Ghostbusters. They&apos;re better equipped than lawyers.)
      </p>

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
