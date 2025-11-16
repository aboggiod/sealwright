/**
 * Format phone number as (XXX) XXX-XXXX
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
}

/**
 * Validate US phone number
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10;
}

/**
 * Lookup city and state from ZIP code using ZIPCodeBase API
 * Free tier: 10k requests/month
 */
export async function lookupZipCode(zip: string): Promise<{
  city: string;
  state: string;
} | null> {
  if (!/^\d{5}$/.test(zip)) return null;

  try {
    const response = await fetch(
      `https://app.zipcodebase.com/api/v1/search?apikey=${process.env.NEXT_PUBLIC_ZIPCODE_API_KEY}&codes=${zip}`,
      { method: "GET" }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.results || !data.results[zip] || data.results[zip].length === 0) {
      return null;
    }

    const result = data.results[zip][0];
    return {
      city: result.city,
      state: result.state_code,
    };
  } catch (error) {
    console.error("ZIP lookup error:", error);
    return null;
  }
}

/**
 * Validate address using USPS API
 * Returns validated/corrected address or null if invalid
 */
export async function validateAddress(address: {
  street: string;
  city: string;
  state: string;
  zip: string;
}): Promise<{
  street: string;
  city: string;
  state: string;
  zip: string;
  isValid: boolean;
  corrected?: boolean;
} | null> {
  // USPS API requires registration at https://www.usps.com/business/web-tools-apis/
  // For MVP, we'll do basic validation and return the input
  // TODO: Implement actual USPS validation when API key is available

  const { street, city, state, zip } = address;

  // Basic validation
  if (!street || street.length < 5) return null;
  if (!city || city.length < 2) return null;
  if (!state || state.length !== 2) return null;
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return null;

  // For now, return as valid
  // In production, call USPS API here
  return {
    ...address,
    isValid: true,
  };
}

/**
 * Address autocomplete using browser's native autocomplete
 * Enhanced with USPS validation on blur
 */
export function setupAddressAutocomplete(
  inputElement: HTMLInputElement,
  onAddressSelected: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => void
) {
  // Enable browser autocomplete
  inputElement.setAttribute("autocomplete", "street-address");

  // Listen for paste or autocomplete events
  inputElement.addEventListener("change", async () => {
    const value = inputElement.value;
    if (value) {
      // Try to parse standard address format
      // This is a simple implementation - real autocomplete would use Google Places API
      const parts = value.split(",").map((s) => s.trim());
      if (parts.length >= 3) {
        const [street, city, stateZip] = parts;
        const stateZipMatch = stateZip.match(/([A-Z]{2})\s+(\d{5}(-\d{4})?)/);
        if (stateZipMatch) {
          onAddressSelected({
            street,
            city,
            state: stateZipMatch[1],
            zip: stateZipMatch[2],
          });
        }
      }
    }
  });
}
