'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SignatureCanvas from 'react-signature-canvas';
import { ChevronRight, Check } from 'lucide-react';

export default function LLCFormation() {
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'full' | ''>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [rushOption, setRushOption] = useState('standard');
  const [addOns, setAddOns] = useState({
    registeredAgent: false,
    businessAddress: false,
    dba: false
  });

  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureData, setSignatureData] = useState('');
  const [uploadedAOO, setUploadedAOO] = useState<File | null>(null);
  const [uploadedInstructions, setUploadedInstructions] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    businessPurpose: '',
    county: 'Albany',
    registeredAddress: '',
    memberName: '',
    memberAddress: '',
    memberOwnership: '100',
    email: '',
    phone: ''
  });

  const calculatePrice = () => {
    let price = 0;

    // Base package price
    if (selectedPackage === 'basic') price = 249;
    else if (selectedPackage === 'premium') price = 399;
    else if (selectedPackage === 'full') price = 699;

    // Rush fees
    if (selectedPackage === 'basic') {
      if (rushOption === 'same-day') price += 5;
      else if (rushOption === 'two-hour') price += 15;
    } else if (selectedPackage === 'premium' && rushOption === 'two-hour') {
      price += 15;
    }

    // Add-ons (Basic package only)
    if (selectedPackage === 'basic') {
      if (addOns.registeredAgent) price += 75;
      if (addOns.businessAddress) price += 75;
      if (addOns.dba) price += 50;
    }

    // Premium package add-ons
    if (selectedPackage === 'premium') {
      if (addOns.dba) price += 25;
    }

    // Full package add-ons
    if (selectedPackage === 'full') {
      if (addOns.businessAddress) price += 75; // 2 years
    }

    return price;
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      setSignatureData(signatureRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'aoo' | 'instructions') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'aoo') setUploadedAOO(file);
      else setUploadedInstructions(file);
    }
  };

  const handleSubmit = () => {
    const orderData = {
      package: selectedPackage,
      rushOption,
      addOns,
      formData,
      signatureData,
      uploadedFiles: {
        aoo: uploadedAOO?.name,
        instructions: uploadedInstructions?.name
      },
      totalPrice: calculatePrice()
    };

    // Save to localStorage for now
    localStorage.setItem('llc-order', JSON.stringify(orderData));
    console.log('Order submitted:', orderData);
    // TODO: Redirect to Stripe checkout
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-display text-primary mb-2">LLC Formation Service</h1>
        <p className="text-gray-600 mb-8">Professional formation at Albany prices</p>

        {/* Package Selection */}
        {!selectedPackage && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2"
              onClick={() => setSelectedPackage('basic')}
            >
              <CardHeader>
                <CardTitle className="text-primary">Basic Package</CardTitle>
                <div className="text-3xl font-bold text-accent">$249</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    You provide AOO
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    We file with NYS
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Filing receipt via email
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Free EIN assistance
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    24 hour turnaround
                  </li>
                  <li className="text-gray-500 italic">Add-ons available</li>
                </ul>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Select Basic
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-accent"
              onClick={() => setSelectedPackage('premium')}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-primary">Premium Package</CardTitle>
                  <span className="text-xs bg-accent text-primary px-2 py-1 rounded">POPULAR</span>
                </div>
                <div className="text-3xl font-bold text-accent">$399</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    We prepare your AOO
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Digital signature on site
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Same day processing
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    1 year registered agent
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    1 year business address
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    1 Certificate of Good Standing
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-accent hover:bg-accent/90 text-primary">
                  Select Premium
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2"
              onClick={() => setSelectedPackage('full')}
            >
              <CardHeader>
                <CardTitle className="text-primary">Full Package</CardTitle>
                <div className="text-3xl font-bold text-accent">$699</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Everything in Premium
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    2 years registered agent
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    1st biennial statement
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    2 Certificates of Good Standing
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    FREE D/B/A filing
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Publishing + certificate
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                  Select Full Service
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Basic Package Flow */}
        {selectedPackage === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic LLC Formation - Upload Your Documents</CardTitle>
              <CardDescription>Total: ${calculatePrice()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File uploads */}
              <div>
                <Label htmlFor="aoo-upload">Upload Your Articles of Organization</Label>
                <div className="mt-2 p-4 border-2 border-dashed rounded-lg">
                  <Input
                    id="aoo-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'aoo')}
                  />
                  {uploadedAOO && (
                    <p className="text-sm text-green-600 mt-2">✓ {uploadedAOO.name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="instructions-upload">Upload Filing Instructions (optional)</Label>
                <div className="mt-2 p-4 border-2 border-dashed rounded-lg">
                  <Input
                    id="instructions-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e, 'instructions')}
                  />
                  {uploadedInstructions && (
                    <p className="text-sm text-green-600 mt-2">✓ {uploadedInstructions.name}</p>
                  )}
                </div>
              </div>

              {/* Rush options */}
              <div>
                <Label>Processing Speed</Label>
                <RadioGroup value={rushOption} onValueChange={setRushOption} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard (24 hours) - Included</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="same-day" id="same-day" />
                    <Label htmlFor="same-day">Same Day - +$5</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="two-hour" id="two-hour" />
                    <Label htmlFor="two-hour">2-Hour Rush - +$15</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Add-ons */}
              <div>
                <Label>Add-On Services</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ra"
                      checked={addOns.registeredAgent}
                      onCheckedChange={(checked) =>
                        setAddOns(prev => ({...prev, registeredAgent: checked as boolean}))}
                    />
                    <Label htmlFor="ra">Registered Agent Service - +$75/year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ba"
                      checked={addOns.businessAddress}
                      onCheckedChange={(checked) =>
                        setAddOns(prev => ({...prev, businessAddress: checked as boolean}))}
                    />
                    <Label htmlFor="ba">Business Address Service - +$75/year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dba"
                      checked={addOns.dba}
                      onCheckedChange={(checked) =>
                        setAddOns(prev => ({...prev, dba: checked as boolean}))}
                    />
                    <Label htmlFor="dba">D/B/A Filing - +$50</Label>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={() => setSelectedPackage('')}>
                  Back to Packages
                </Button>
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent mb-2">Total: ${calculatePrice()}</div>
                  <Button
                    className="bg-accent hover:bg-accent/90 text-primary"
                    onClick={handleSubmit}
                    disabled={!uploadedAOO || !formData.email}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium/Full Package Flow */}
        {(selectedPackage === 'premium' || selectedPackage === 'full') && (
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPackage === 'premium' ? 'Premium' : 'Full Service'} LLC Formation
              </CardTitle>
              <CardDescription>We&apos;ll prepare everything for you</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Business Information</h3>

                  <div>
                    <Label htmlFor="business-name">Proposed Business Name</Label>
                    <Input
                      id="business-name"
                      placeholder="Your Business Name, LLC"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({...prev, businessName: e.target.value}))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Must end with LLC or L.L.C.</p>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Business Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe your business activities..."
                      value={formData.businessPurpose}
                      onChange={(e) => setFormData(prev => ({...prev, businessPurpose: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="county">County</Label>
                    <select
                      id="county"
                      className="w-full p-2 border rounded"
                      value={formData.county}
                      onChange={(e) => setFormData(prev => ({...prev, county: e.target.value}))}
                    >
                      <option value="Albany">Albany County</option>
                      <option value="Kings">Kings County (Brooklyn)</option>
                      <option value="New York">New York County (Manhattan)</option>
                      <option value="Queens">Queens County</option>
                      <option value="Bronx">Bronx County</option>
                      <option value="Richmond">Richmond County (Staten Island)</option>
                      <option value="Westchester">Westchester County</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="address">Principal Office Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, Albany, NY 12203"
                      value={formData.registeredAddress}
                      onChange={(e) => setFormData(prev => ({...prev, registeredAddress: e.target.value}))}
                    />
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setCurrentStep(1)}
                    disabled={!formData.businessName || !formData.businessPurpose || !formData.registeredAddress}
                  >
                    Continue to Member Info <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Member Information</h3>

                  <div>
                    <Label htmlFor="member-name">Member/Manager Name</Label>
                    <Input
                      id="member-name"
                      placeholder="John Smith"
                      value={formData.memberName}
                      onChange={(e) => setFormData(prev => ({...prev, memberName: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="member-address">Member Address</Label>
                    <Input
                      id="member-address"
                      placeholder="456 Oak Ave, Albany, NY 12203"
                      value={formData.memberAddress}
                      onChange={(e) => setFormData(prev => ({...prev, memberAddress: e.target.value}))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ownership">Ownership Percentage</Label>
                    <Input
                      id="ownership"
                      type="number"
                      value={formData.memberOwnership}
                      onChange={(e) => setFormData(prev => ({...prev, memberOwnership: e.target.value}))}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.memberName || !formData.memberAddress}
                    >
                      Continue to Signature <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Digital Signature</h3>

                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <Label>Sign Below</Label>
                    <SignatureCanvas
                      ref={signatureRef}
                      canvasProps={{
                        className: 'signature-canvas border-2 border-gray-200 rounded mt-2 w-full',
                        width: 500,
                        height: 200
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSignature}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveSignature}
                      >
                        Save Signature
                      </Button>
                    </div>
                    {signatureData && (
                      <p className="text-sm text-green-600 mt-2">✓ Signature saved</p>
                    )}
                  </div>

                  {/* Rush option for premium */}
                  {selectedPackage === 'premium' && (
                    <div>
                      <Label>Processing Speed</Label>
                      <RadioGroup value={rushOption} onValueChange={setRushOption} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="same-day" id="same-day-premium" />
                          <Label htmlFor="same-day-premium">Same Day - Included</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="two-hour" id="two-hour-premium" />
                          <Label htmlFor="two-hour-premium">2-Hour Rush - +$15</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Premium add-ons */}
                  {selectedPackage === 'premium' && (
                    <div>
                      <Label>Additional Services</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="dba-premium"
                          checked={addOns.dba}
                          onCheckedChange={(checked) =>
                            setAddOns(prev => ({...prev, dba: checked as boolean}))}
                        />
                        <Label htmlFor="dba-premium">D/B/A Filing - +$25</Label>
                      </div>
                    </div>
                  )}

                  {/* Full package add-ons */}
                  {selectedPackage === 'full' && (
                    <div>
                      <Label>Optional Add-On</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="ba-full"
                          checked={addOns.businessAddress}
                          onCheckedChange={(checked) =>
                            setAddOns(prev => ({...prev, businessAddress: checked as boolean}))}
                        />
                        <Label htmlFor="ba-full">2 Years Business Address Service - +$75</Label>
                      </div>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent mb-2">Total: ${calculatePrice()}</div>
                      <Button
                        className="bg-accent hover:bg-accent/90 text-primary"
                        onClick={handleSubmit}
                        disabled={!signatureData || !formData.email}
                      >
                        Complete Order
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
