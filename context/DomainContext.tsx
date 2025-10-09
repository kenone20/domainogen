import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { DomainSuggestion, DomainAnalysis } from '../types';

interface DomainContextType {
  suggestions: DomainSuggestion[];
  favorites: DomainSuggestion[];
  currentAnalysis: DomainAnalysis | null;
  setSuggestions: React.Dispatch<React.SetStateAction<DomainSuggestion[]>>;
  toggleFavorite: (domainName: string) => void;
  setCurrentAnalysis: (analysis: DomainAnalysis | null) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [favorites, setFavorites] = useState<DomainSuggestion[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<DomainAnalysis | null>(null);

  const toggleFavorite = useCallback((domainName: string) => {
    setFavorites(prev => {
      const isFavorited = prev.some(d => d.name === domainName);
      if (isFavorited) {
        return prev.filter(d => d.name !== domainName);
      } else {
        const domainToAdd = suggestions.find(d => d.name === domainName) 
            || favorites.find(d => d.name === domainName); // Also check favorites list
        
        // When adding, ensure it has a default status if it's not in suggestions
        return domainToAdd ? [...prev, { ...domainToAdd, isFavorited: true }] : prev;
      }
    });

    setSuggestions(prev => prev.map(d => 
      d.name === domainName ? { ...d, isFavorited: !d.isFavorited } : d
    ));
  }, [suggestions, favorites]);

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