import { mongoService } from '@/services/mongoService';
import { logout as apiLogout } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

// Interface for the return type of saveUser
interface SaveUserResult {
  success: boolean;
  id?: string;
}

// Interface to define the expected shape of the MongoDB save result
interface MongoSaveResult {
  id?: string | number;
  [key: string]: any;
}

// Mock function to simulate social provider auth
export const socialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
  console.log(`Authenticating with ${provider}...`);
  
  // In a real implementation, this would integrate with the actual provider SDKs
  // For now, we'll simulate a successful login with mock data
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on provider
  const userData = {
    id: `user-${Math.random().toString(36).substring(2, 9)}`,
    name: provider === 'google' ? 'Google User' : 
          provider === 'facebook' ? 'Facebook User' : 'Apple User',
    email: `user.${provider}@example.com`,
    provider
  };
  
  try {
    // Save user to MongoDB
    const saveResult = await mongoService.saveUser({
      name: userData.name,
      email: userData.email,
      provider: provider,
      providerUserId: userData.id,
      balance: 50000, // Starting balance in RWF
      currency: 'RWF'
    });
    
    // Create a proper SaveUserResult object
    let result: SaveUserResult = {
      success: false
    };
    
    // Handle various types of saveResult with proper null checking
    if (saveResult !== null && saveResult !== undefined) {
      // Set success to true if we have a result
      result.success = true;
      
      // Try to get an ID from the result if it exists
      if (typeof saveResult === 'object') {
        // Use type assertion to access id property safely
        const resultObj = saveResult as { id?: string | number };
        if (resultObj && resultObj.id) {
          result.id = String(resultObj.id);
        }
      } else if (typeof saveResult === 'boolean') {
        // If saveResult is just a boolean, use it for success
        result.success = saveResult;
      }
    }
    
    if (result.success) {
      // Store auth data in localStorage (in a real app, this would be more secure)
      localStorage.setItem('userToken', result.id || `sample-jwt-token-${provider}-${userData.id}`);
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userProvider', provider);
      
      console.log('User logged in successfully, stored in MongoDB:', result);
      
      // Dispatch a custom event to notify other components about auth state change
      window.dispatchEvent(new CustomEvent('authChange'));
      
      return {
        ...userData,
        id: result.id || userData.id
      };
    }
    
    console.error('Error in MongoDB save:', result);
    return userData;
  } catch (error) {
    console.error('Error during login process:', error);
    
    // Fall back to local storage only if MongoDB fails
    localStorage.setItem('userToken', `sample-jwt-token-${provider}-${userData.id}`);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userProvider', provider);
    
    window.dispatchEvent(new CustomEvent('authChange'));
    
    return userData;
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

// Function to create the first admin in the system using the create_first_admin function
export const createFirstAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log("Attempting to create first admin with user ID:", userId);
    
    const { data, error } = await supabase.rpc('create_first_admin', {
      admin_user_id: userId
    });
    
    if (error) {
      console.error("Error creating first admin:", error);
      return false;
    }
    
    console.log("Create first admin response:", data);
    return data === true;
  } catch (error) {
    console.error("Error in createFirstAdmin:", error);
    return false;
  }
};

// Function to add a user as an admin (only callable by admins)
export const addAdmin = async (userId: string): Promise<boolean> => {
  try {
    // First try to use the create_first_admin function
    const isFirstAdmin = await createFirstAdmin(userId);
    if (isFirstAdmin) {
      console.log("Successfully created first admin");
      return true;
    }
    
    // If not the first admin, try regular insertion
    const { error } = await supabase
      .from('user_roles')
      .insert([
        { user_id: userId, role: 'admin' }
      ]);
    
    if (error) {
      // If it's a unique constraint error, the user might already be an admin
      if (error.code === '23505') {
        console.log("User is already an admin");
        return true;
      }
      
      console.error("Error adding admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addAdmin:", error);
    return false;
  }
};
