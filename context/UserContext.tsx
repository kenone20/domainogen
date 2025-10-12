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
    isPro: true, // All features are now free, so everyone is a "Pro" user.
  });

  // This function is now a no-op as there is only one free plan.
  const togglePro = () => {
    console.log("Toggling Pro is disabled. All features are currently free.");
  };

  // This function is now a no-op as generation limits are removed.
  const useGeneration = () => {};

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