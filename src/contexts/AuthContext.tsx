import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { hashCode } from '@/utils/authHash';

// Pre-computed hash of the access code
const VALID_CODE_HASH = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Storage key for session
const AUTH_STORAGE_KEY = 'fullstack_map_authenticated';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validHash, setValidHash] = useState<string>('');

  // Compute the valid hash on mount
  useEffect(() => {
    const computeHash = async () => {
      const code = 'gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E';
      const hash = await hashCode(code);
      setValidHash(hash);
      
      // Check if already authenticated
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === hash) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    
    computeHash();
  }, []);

  const login = async (code: string): Promise<boolean> => {
    const inputHash = await hashCode(code);
    if (inputHash === validHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, inputHash);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
