import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types/auth.types';
import { authApi, GoogleLoginPayload } from '../services/auth.api';
import {
  clearStoredSession,
  getStoredToken,
  getStoredUserJson,
  setStoredSession,
} from '../services/api-client';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (payload: GoogleLoginPayload) => Promise<void>;
  loginWithDevProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = getStoredUserJson();
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .getProfile()
      .then((profile) => {
        setUser(profile);
        setStoredSession(token, JSON.stringify(profile));
      })
      .catch(() => {
        clearStoredSession();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const loginWithGoogle = useCallback(async (payload: GoogleLoginPayload) => {
    const response = await authApi.loginWithGoogle(payload);
    setStoredSession(response.accessToken, JSON.stringify(response.user));
    setUser(response.user);
  }, []);

  const loginWithDevProfile = useCallback(async () => {
    const response = await authApi.loginWithDevMode({
      name: 'Dra. Mariana Gomes',
      email: 'mariana@silvagomes.com',
      picture:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    });
    setStoredSession(response.accessToken, JSON.stringify(response.user));
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginWithGoogle,
        loginWithDevProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
