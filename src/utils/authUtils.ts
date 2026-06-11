import { logout as apiLogout } from '@/services/authService';
import { apiFetch } from '@/lib/api';
import { storeAuthSession } from '@/services/authService';

// Mock function to simulate social provider auth using backend endpoint
export const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
  console.log(`Authenticating with ${provider}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const randomId = Math.random().toString(36).substring(2, 9);
  const email = `user.${provider}.${randomId}@example.com`;
  const name = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User ${randomId}`;
  const providerUserId = `social-${provider}-${randomId}`;

  try {
    // Call the Django social login endpoint
    const session = await apiFetch('/auth/social-login/', {
      method: 'POST',
      body: JSON.stringify({
        provider,
        provider_user_id: providerUserId,
        email,
        name
      })
    });
    
    if (session && session.access) {
      storeAuthSession(session);
      // Dispatch a custom event to notify other components about auth state change
      window.dispatchEvent(new CustomEvent('authChange'));
      return session.user;
    } else {
      throw new Error("Invalid session response from social login API");
    }
  } catch (error) {
    console.error('Error during social login process:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('accessToken') !== null;
};

// Logout function
export const logout = async () => {
  try {
    await apiLogout();
    return true;
  } catch (error) {
    console.error("Error during logout:", error);
    return false;
  }
};

// Function to get current user data
export const getCurrentUser = () => {
  if (!isAuthenticated()) return null;
  
  return {
    token: localStorage.getItem('userToken'),
    name: localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail'),
    provider: localStorage.getItem('userProvider'),
  };
};

// Listen for auth changes
export const listenForAuthChanges = (callback: () => void) => {
  window.addEventListener('authChange', callback);
  window.addEventListener('storage', callback); // For cross-tab sync
  
  return () => {
    window.removeEventListener('authChange', callback);
    window.removeEventListener('storage', callback);
  };
};

// Check if current user is an admin (synchronous - reads localStorage directly)
export const isAdminUser = (): boolean => {
  if (!isAuthenticated()) return false;
  return localStorage.getItem('userRole') === 'admin';
};

// Check if current user is an admin (async version - kept for compatibility)
export const isAdmin = async (): Promise<boolean> => {
  return isAdminUser();
};

