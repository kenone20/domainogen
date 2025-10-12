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
  apiKey?: string; // For demo purposes, not for production
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  style: string;
  tlds: string[];
  suggestions: DomainSuggestion[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  analysis: DomainAnalysis;
}

export type HistoryItem = 
  | { type: 'generation'; data: GenerationHistoryItem }
  | { type: 'analysis'; data: AnalysisHistoryItem };