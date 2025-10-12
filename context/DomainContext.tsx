import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { DomainSuggestion, DomainAnalysis } from '../types';

interface DomainContextType {
  suggestions: DomainSuggestion[];
  favorites: DomainSuggestion[];
  currentAnalysis: DomainAnalysis | null;
  setSuggestions: React.Dispatch<React.SetStateAction<DomainSuggestion[]>>;
  toggleFavorite: (domain: DomainSuggestion) => void;
  setCurrentAnalysis: (analysis: DomainAnalysis | null) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [favorites, setFavorites] = useState<DomainSuggestion[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<DomainAnalysis | null>(null);

  const toggleFavorite = useCallback((domainToToggle: DomainSuggestion) => {
    setFavorites(prev => {
      const isFavorited = prev.some(d => d.name === domainToToggle.name);
      if (isFavorited) {
        return prev.filter(d => d.name !== domainToToggle.name);
      } else {
        // When adding, ensure it has the correct favorited status
        return [...prev, { ...domainToToggle, isFavorited: true }];
      }
    });

    setSuggestions(prev => prev.map(d => 
      d.name === domainToToggle.name ? { ...d, isFavorited: !d.isFavorited } : d
    ));
  }, []);

  return (
    <DomainContext.Provider value={{ suggestions, favorites, currentAnalysis, setSuggestions, toggleFavorite, setCurrentAnalysis }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = (): DomainContextType => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
};
