
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { UserProfile } from '../types';

interface UserContextType {
  user: UserProfile;
  togglePro: () => void;
  useGeneration: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({
    isPro: false,
    generationsLeft: 5,
  });

  const togglePro = () => {
    setUser(prev => ({ ...prev, isPro: !prev.isPro }));
  };

  const useGeneration = () => {
    if (!user.isPro) {
      setUser(prev => ({...prev, generationsLeft: Math.max(0, prev.generationsLeft - 1)}));
    }
  };

  return (
    <UserContext.Provider value={{ user, togglePro, useGeneration }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
