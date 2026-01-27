export type VisaStatus = 'visa_free' | 'evisa' | 'visa_on_arrival' | 'required';

export interface Country {
    code: string;
    name: string;
}

export interface TravelRequirements {
    visa: {
        status: VisaStatus;
        details: string;
        max_stay?: string;
    };
    customs: {
        allowance: {
            alcohol: string;
            tobacco: string;
            cash: string;
        };
        prohibited: string[];
    };
    legal: {
        driving_side: 'left' | 'right';
        alcohol_policy: string;
        drone_laws: string;
        special_laws?: string[];
    };
    local: {
        currency: string;
        currency_symbol: string;
        voltage: string;
        socket_type: string;
        emergency_number: number;
        tipping_culture: string;
    };
}

export const countries: Country[] = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
];

const visaMatrix: Record<string, Record<string, VisaStatus>> = {
    US: { GB: 'visa_free', CA: 'visa_free', JP: 'visa_free', AE: 'visa_free', IN: 'evisa', CN: 'required' },
    GB: { US: 'evisa', CA: 'evisa', JP: 'visa_free', AE: 'visa_free', IN: 'evisa', CN: 'required' },
    IN: { US: 'required', GB: 'required', JP: 'evisa', AE: 'visa_on_arrival', CN: 'required' },
};

// Mock Detailed Data for Destinations (Simplified for Demo)
const countryDetails: Record<string, Omit<TravelRequirements, 'visa'>> = {
    JP: {
        customs: {
            allowance: { alcohol: "3 bottles (760ml each)", tobacco: "400 cigarettes", cash: "1M JPY" },
            prohibited: ["Narcotics", "Firearms", "Counterfeit goods", "Pornography"]
        },
        legal: {
            driving_side: 'left',
            alcohol_policy: "Legal drinking age is 20. Zero tolerance for driving.",
            drone_laws: "Registration required over 100g. No fly zones in cities.",
            special_laws: ["Carrying a knife/pocket knife is illegal without cause."]
        },
        local: {
            currency: "Japanese Yen",
            currency_symbol: "¥",
            voltage: "100V",
            socket_type: "Type A / B",
            emergency_number: 119,
            tipping_culture: "No tipping. It can be considered rude."
        }
    },
    GB: {
        customs: {
            allowance: { alcohol: "4L Spirits or 9L Wine", tobacco: "200 cigarettes", cash: "10k GBP" },
            prohibited: ["Offensive weapons", "Self defense sprays", "Endangered species"]
        },
        legal: {
            driving_side: 'left',
            alcohol_policy: "Legal drinking age 18. Strict drink drive limits.",
            drone_laws: "Operator ID required. Keep 50m from people."
        },
        local: {
            currency: "British Pound",
            currency_symbol: "£",
            voltage: "230V",
            socket_type: "Type G",
            emergency_number: 999,
            tipping_culture: "10-15% in restaurants is standard."
        }
    },
    AE: {
        customs: {
            allowance: { alcohol: "4L (Non-Muslims only)", tobacco: "400 cigarettes", cash: "100k AED" },
            prohibited: ["Pork products (variable)", "E-cigarettes", "Gambling tools"]
        },
        legal: {
            driving_side: 'right',
            alcohol_policy: "Licensed venues only. Public intoxication is illegal.",
            drone_laws: "Strictly regulated. Registration mandatory.",
            special_laws: ["PDA (Public Displays of Affection) is frowned upon/illegal.", "Swearing in public is a crime."]
        },
        local: {
            currency: "Dirham",
            currency_symbol: "AED",
            voltage: "230V",
            socket_type: "Type G",
            emergency_number: 999,
            tipping_culture: "10-15% is appreciated but not mandatory."
        }
    },
    FR: {
        customs: {
            allowance: { alcohol: "10L Spirits (EU) / 1L (Non-EU)", tobacco: "800 cigs (EU) / 200 (Non-EU)", cash: "10k EUR" },
            prohibited: ["Counterfeit goods", "Endangered species", "Meat/Dairy from non-EU"]
        },
        legal: {
            driving_side: 'right',
            alcohol_policy: "Legal age 18. Strict laws on public disorder.",
            drone_laws: "Banned in Paris and urban areas. Max height 120m.",
        },
        local: {
            currency: "Euro",
            currency_symbol: "€",
            voltage: "230V",
            socket_type: "Type E",
            emergency_number: 112,
            tipping_culture: "Service included. Small change appreciated."
        }
    },
    DE: {
        customs: {
            allowance: { alcohol: "10L Spirits (EU)", tobacco: "800 cigs (EU)", cash: "10k EUR" },
            prohibited: ["Unconstitutional symbols", "Dangerous dogs", "Switchblades"]
        },
        legal: {
            driving_side: 'right',
            alcohol_policy: "Beer/Wine at 16, Spirits at 18. Public drinking allowed.",
            drone_laws: "Insurance mandatory. Label with name/address.",
            special_laws: ["Quiet hours (Ruhezeit) on Sundays/Holidays."]
        },
        local: {
            currency: "Euro",
            currency_symbol: "€",
            voltage: "230V",
            socket_type: "Type F",
            emergency_number: 112,
            tipping_culture: "Round up or 5-10%."
        }
    },
    SG: {
        customs: {
            allowance: { alcohol: "2L Wine/Beer", tobacco: "NO DUTY FREE ALLOWANCE", cash: "20k SGD" },
            prohibited: ["Chewing gum", "E-cigarettes", "Chewing tobacco", "Firecrackers"]
        },
        legal: {
            driving_side: 'left',
            alcohol_policy: "No drinking in public 10:30pm-7am.",
            drone_laws: "Permit required >250g. No flying near Changi.",
            special_laws: ["Littering/Spitting implies heavy fines.", "Drug trafficking carries death penalty."]
        },
        local: {
            currency: "Singapore Dollar",
            currency_symbol: "S$",
            voltage: "230V",
            socket_type: "Type G",
            emergency_number: 995,
            tipping_culture: "Not encouraged. 10% service charge usually included."
        }
    }
};

const defaultDetails: Omit<TravelRequirements, 'visa'> = {
    customs: {
        allowance: { alcohol: "Check local limits", tobacco: "Check local limits", cash: "10k USD equivalent" },
        prohibited: ["Narcotics", "Weapons"]
    },
    legal: {
        driving_side: 'right',
        alcohol_policy: "Check local laws.",
        drone_laws: "Check local aviation authority."
    },
    local: {
        currency: "Unknown",
        currency_symbol: "$",
        voltage: "230V",
        socket_type: "Type C",
        emergency_number: 112,
        tipping_culture: "Research recommended."
    }
};

export const getTravelRequirements = async (passport: string, destination: string): Promise<TravelRequirements> => {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Determine Visa Status
    let visaStatus: VisaStatus = 'required';
    if (passport === destination) visaStatus = 'visa_free';
    else if (visaMatrix[passport]?.[destination]) visaStatus = visaMatrix[passport][destination];

    // Get Details
    const details = countryDetails[destination] || defaultDetails;

    return {
        visa: {
            status: visaStatus,
            details: visaStatus === 'visa_free'
                ? "Passport must be valid for stay duration."
                : "Check embassy for specific validity requirements.",
            max_stay: visaStatus === 'visa_free' ? "90 days" : "Variable"
        },
        ...details
    };
};
