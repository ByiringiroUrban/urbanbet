import { apiFetch } from '@/lib/api';

export const getStoredUser = () => {
  const email = localStorage.getItem('userEmail');
  if (!email) return null;
  
  return {
    email,
    name: localStorage.getItem('userName') || 'Urban Bet User',
    provider: localStorage.getItem('userProvider') || 'email',
    balance: localStorage.getItem('userBalance') || '50000',
    currency: (localStorage.getItem('userCurrency') || 'RWF') as 'USD' | 'RWF',
    role: localStorage.getItem('userRole') || 'user',
  };
};

export const storeAuthSession = (session: {
  access: string;
  refresh: string;
  user: {
    id: string | number;
    email: string;
    name: string;
    role: string;
    balance: string | number;
    currency: 'USD' | 'RWF';
    provider?: string;
    avatar?: string | null;
  };
}) => {
  localStorage.setItem('accessToken', session.access);
  localStorage.setItem('refreshToken', session.refresh);
  localStorage.setItem('userToken', String(session.user.id));
  localStorage.setItem('userName', session.user.name || 'Urban Bet User');
  localStorage.setItem('userEmail', session.user.email);
  localStorage.setItem('userRole', session.user.role || 'user');
  localStorage.setItem('userProvider', session.user.provider || 'email');
  localStorage.setItem('userBalance', String(session.user.balance));
  localStorage.setItem('userCurrency', session.user.currency || 'RWF');
  if (session.user.avatar) {
    localStorage.setItem('userAvatar', session.user.avatar);
  } else {
    localStorage.removeItem('userAvatar');
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userProvider');
  localStorage.removeItem('userBalance');
  localStorage.removeItem('userCurrency');
  localStorage.removeItem('userAvatar');
};

export const login = async (email: string, password: string): Promise<any> => {
  const session = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (session && session.access) {
    storeAuthSession(session);
    window.dispatchEvent(new CustomEvent('authChange'));
  }
  return session;
};

export const register = async (userData: any): Promise<any> => {
  const session = await apiFetch('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (session && session.access) {
    storeAuthSession(session);
    window.dispatchEvent(new CustomEvent('authChange'));
  }
  return session;
};

export const logout = async (): Promise<void> => {
  const refresh = localStorage.getItem('refreshToken');
  try {
    if (refresh) {
      await apiFetch('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('authChange'));
  }
};

export const getProfile = async (): Promise<any> => {
  return await apiFetch('/auth/profile/');
};

export const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await apiFetch('/auth/delete-account/', {
      method: 'DELETE',
    });
    clearAuthSession();
    window.dispatchEvent(new CustomEvent('authChange'));
    return { success: true };
  } catch (error) {
    console.error('Delete account failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete account' 
    };
  }
};
