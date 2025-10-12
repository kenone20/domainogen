import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { HistoryItem, GenerationHistoryItem, AnalysisHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'domainogen-history';

interface HistoryContextType {
  history: HistoryItem[];
  addGenerationToHistory: (generation: GenerationHistoryItem) => void;
  addAnalysisToHistory: (analysis: AnalysisHistoryItem) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error reading history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history to localStorage', error);
    }
  }, [history]);

  const addGenerationToHistory = useCallback((generation: GenerationHistoryItem) => {
    const newHistoryItem: HistoryItem = { type: 'generation', data: generation };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 50)); // Limit history to 50 items
  }, []);

  const addAnalysisToHistory = useCallback((analysisItem: AnalysisHistoryItem) => {
    setHistory(prev => {
      // Avoid adding duplicate analysis if it's already the most recent item
      if (prev.length > 0 && prev[0].type === 'analysis' && prev[0].data.analysis.domain === analysisItem.analysis.domain) {
        return prev;
      }
      const newHistoryItem: HistoryItem = { type: 'analysis', data: analysisItem };
      return [newHistoryItem, ...prev].slice(0, 50); // Limit history to 50 items
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addGenerationToHistory, addAnalysisToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
