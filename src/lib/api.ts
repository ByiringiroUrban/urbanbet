export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Prepare headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    if (response.ok) {
      if (response.status === 204) {
        return null;
      }
      return await response.json();
    }

    // Handle 401 and attempt token refresh
    if (response.status === 401 && localStorage.getItem('refreshToken')) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: localStorage.getItem('refreshToken'),
            }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.access;
            localStorage.setItem('accessToken', newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
          } else {
            // Refresh failed, log user out
            isRefreshing = false;
            clearLocalAuthSession();
            throw new ApiError('Session expired. Please log in again.', 401);
          }
        } catch (refreshErr) {
          isRefreshing = false;
          clearLocalAuthSession();
          throw refreshErr;
        }
      }

      // If token is refreshing, queue this request
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          const retryHeaders = new Headers(options.headers || {});
          if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
            retryHeaders.set('Content-Type', 'application/json');
          }
          retryHeaders.set('Authorization', `Bearer ${token}`);
          
          fetch(url, { ...options, headers: retryHeaders })
            .then((res) => {
              if (res.ok) {
                if (res.status === 204) {
                  resolve(null);
                } else {
                  resolve(res.json());
                }
              } else {
                res.json().then((errData) => {
                  reject(new ApiError(getErrorMessage(errData) || 'An error occurred', res.status, errData));
                }).catch(() => {
                  reject(new ApiError('An error occurred', res.status));
                });
              }
            })
            .catch(reject);
        });
      });
    }

    // Try parsing error message from JSON response
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      // response is not JSON
    }

    const errorMessage = getErrorMessage(errorData) || `HTTP error! Status: ${response.status}`;
    throw new ApiError(errorMessage, response.status, errorData);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'A network error occurred',
      0
    );
  }
}

function clearLocalAuthSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userProvider');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('userBalance');
  localStorage.removeItem('userCurrency');
  window.dispatchEvent(new CustomEvent('authChange'));
}

// Helper to extract a friendly error message from backend serializer errors
function getErrorMessage(errorData: any): string | null {
  if (!errorData) return null;
  if (typeof errorData === 'string') return errorData;
  if (errorData.detail) return errorData.detail;
  if (errorData.message) return errorData.message;

  if (typeof errorData === 'object') {
    // Check for array of field errors
    const firstKey = Object.keys(errorData)[0];
    if (firstKey) {
      const fieldErrors = errorData[firstKey];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        return `${firstKey}: ${fieldErrors[0]}`;
      } else if (typeof fieldErrors === 'string') {
        return `${firstKey}: ${fieldErrors}`;
      } else if (typeof fieldErrors === 'object' && fieldErrors !== null) {
        return getErrorMessage(fieldErrors);
      }
    }
  }
  return null;
}

/**
 * Django REST Framework can return either a plain array OR a paginated
 * { count, next, previous, results: [...] } object.
 * This helper normalises both shapes into a plain array safely.
 */
export const toArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.results)) return value.results;
  return [];
};
