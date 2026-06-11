
import { apiFetch } from '@/lib/api';
import { UserData } from './database/types';

// Save or update user profile
export const saveUser = async (userData: UserData): Promise<boolean> => {
  try {
    const response = await apiFetch('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify({
        name: userData.name,
        currency: userData.currency || 'RWF'
      })
    });
    
    if (response) {
      window.dispatchEvent(new CustomEvent('authChange'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

// Get user profile
export const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    const data = await apiFetch('/auth/profile/');
    return {
      id: String(data.id),
      name: data.name,
      email: data.email,
      balance: Number(data.balance),
      currency: data.currency,
      provider: data.provider
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Delete user account
export const deleteUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await apiFetch('/auth/delete-account/', {
      method: 'DELETE'
    });
    
    // Clear token session
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userBalance');
    localStorage.removeItem('userCurrency');
    
    window.dispatchEvent(new CustomEvent('authChange'));
    return { success: true, message: "Account successfully deleted" };
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to delete account'
    };
  }
};

