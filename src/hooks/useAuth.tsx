
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getProfile, getStoredUser, storeAuthSession } from '@/services/authService';
import { listenForAuthChanges } from '@/utils/authUtils';

export interface User {
  token: string | null;
  name: string | null;
  email: string | null;
  provider: string | null;
  balance?: number;
  currency?: 'USD' | 'RWF';
  role?: string;
}

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const buildUserObject = (profile: {
    email: string;
    name: string;
    provider: string;
    balance: string | number;
    currency: 'USD' | 'RWF';
    role: string;
  }, token: string): User => ({
    token,
    name: profile.name || 'Urban Bet User',
    email: profile.email,
    provider: profile.provider || 'email',
    balance: Number(profile.balance),
    currency: profile.currency || 'RWF',
    role: profile.role,
  });

  const clearUserState = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      clearUserState();
      setIsLoading(false);
      return;
    }

    try {
      const profile = await getProfile();
      storeAuthSession({
        access: accessToken,
        refresh: localStorage.getItem('refreshToken') || '',
        user: profile,
      });

      const userObject = buildUserObject(profile, accessToken);
      setUser(userObject);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error fetching user data:', error);

      const storedUser = getStoredUser();
      if (storedUser) {
        const userObject = buildUserObject(storedUser, accessToken);
        setUser(userObject);
        setIsLoggedIn(true);
      } else {
        clearUserState();
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearUserState, toast]);

  useEffect(() => {
    fetchUserData();

    const unsubscribe = listenForAuthChanges(() => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        fetchUserData();
      } else {
        clearUserState();
      }
    });

    return unsubscribe;
  }, [fetchUserData, clearUserState]);

  return {
    isLoggedIn,
    user,
    isLoading,
    refreshUserData: fetchUserData,
  };
};
