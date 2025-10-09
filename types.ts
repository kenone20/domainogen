export interface DomainSuggestion {
  name: string;
  status: 'pending' | 'available' | 'taken';
  isFavorited: boolean;
}

export interface DomainAnalysis {
  domain: string;
  brandability: number;
  seoStrength: number;
  estimatedValue: number;
  summary: string;
  logoSuggestion: {
    prompt: string;
    url?: string;
  };
  colorPalette: string[];
  tagline: string;
  domainAge: string;
}

export interface UserProfile {
  isPro: boolean;
  generationsLeft: number;
  apiKey?: string; // For demo purposes, not for production
}