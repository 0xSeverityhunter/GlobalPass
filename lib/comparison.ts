import { ParsedVisaData } from "./gemini";
import { countries } from "./data";

export interface ComparisonResult {
    status: 'valid' | 'invalid' | 'warning';
    title: string;
    message: string;
    reason?: string;
}

export function compareVisaWithRequirements(
    visa: ParsedVisaData,
    destinationCode: string,
    passportCode: string
): ComparisonResult {
    const destination = countries.find(c => c.code === destinationCode);

    if (!destination) {
        return {
            status: 'warning',
            title: 'Unknown Destination',
            message: 'We could not verify requirements for this destination.'
        };
    }

    // 1. Check if Visa is Expired
    if (!visa.isValid || (visa.daysRemaining !== null && visa.daysRemaining <= 0)) {
        return {
            status: 'invalid',
            title: 'Visa Expired',
            message: `This visa expired on ${visa.expiryDate}. You cannot use it for travel.`,
            reason: 'expiry'
        };
    }

    // 2. Check Expiry Proximity (Warning if < 6 months)
    if (visa.daysRemaining !== null && visa.daysRemaining < 180) {
        return {
            status: 'warning',
            title: 'Expires Soon',
            message: `This visa expires in ${visa.daysRemaining} days. Many countries require 6 months validity properly. Check with embassy.`,
            reason: 'expiry_soon'
        };
    }

    // 3. Name/Type Matching (Simple Heuristic)
    // If destination is in Schengen, and visa says "Schengen", it's valid.
    const schengenCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'GR', 'PT', 'SE', 'CH'];
    const isSchengenDestination = schengenCountries.includes(destinationCode);
    const isSchengenVisa = visa.visaType.toLowerCase().includes('schengen');

    if (isSchengenDestination && isSchengenVisa) {
        return {
            status: 'valid',
            title: 'Valid Schema Visa',
            message: `This Schengen visa allows entry to ${destination.name}. Check specific stay limits.`,
            reason: 'schengen_match'
        };
    }

    // 4. Country Matching
    // If the visa issuing country matches the destination
    // e.g. Visa issued by "United States" -> Destination "United States"
    const visaCountryNormalized = visa.issuingCountry.toLowerCase();
    const destNameNormalized = destination.name.toLowerCase();

    // Fuzzy match check
    if (visaCountryNormalized.includes(destNameNormalized) || destNameNormalized.includes(visaCountryNormalized)) {
        return {
            status: 'valid',
            title: 'Visa Matches Destination',
            message: `This visa was issued by ${destination.name} and appears valid for entry.`,
            reason: 'country_match'
        };
    }

    // Default Fallback
    return {
        status: 'warning',
        title: 'Verification Needed',
        message: `We cannot automatically verify if a "${visa.visaType}" allows entry to ${destination.name}. Please check with the embassy.`,
        reason: 'unknown_match'
    };
}
