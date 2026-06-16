import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// Create an Axios instance with base URL configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token to Axios requests
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Shared promise to hold the token refresh in progress and avoid concurrent calls
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Refresh request failed');
    }

    const data = await response.json();
    if (data.success && data.data) {
      const newToken = data.data.accessToken;
      
      localStorage.setItem('token', newToken);
      if (data.data.refreshToken) {
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }
      return newToken;
    }
    return null;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

// Setup Axios Interceptors
export function setupAxiosInterceptors(onLogout: () => void) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isExpired = error.response?.status === 401 && 
                        (error.response?.data?.message === 'Access token expired' || 
                         (typeof error.response?.data?.message === 'string' && error.response?.data?.message.toLowerCase().includes('expired')));
      
      if (isExpired && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          onLogout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}

// Setup Fetch Interceptor (monkey-patching window.fetch)
export function setupFetchInterceptor(onLogout: () => void) {
  if (typeof window === 'undefined') return;
  if ((window as any).__fetchInterceptorSetup) return;
  (window as any).__fetchInterceptorSetup = true;

  const originalFetch = window.fetch;

  window.fetch = async function (input, init) {
    let url = '';
    if (typeof input === 'string') {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else if (input && typeof input === 'object' && 'url' in input) {
      url = (input as Request).url;
    }

    const isApiRequest = url.startsWith(API_URL) && !url.includes('/auth/refresh-token');

    if (!isApiRequest) {
      return originalFetch(input, init);
    }

    let headers: Record<string, string> = {};
    if (init && init.headers) {
      if (init.headers instanceof Headers) {
        init.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(init.headers)) {
        init.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        headers = { ...init.headers } as Record<string, string>;
      }
    } else if (input && typeof input === 'object' && 'headers' in input) {
      const requestHeaders = (input as Request).headers;
      if (requestHeaders instanceof Headers) {
        requestHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      }
    }

    // Force the use of the latest token in localStorage if Authorization exists
    if (headers['Authorization'] || headers['authorization']) {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        const authKey = headers['Authorization'] ? 'Authorization' : 'authorization';
        headers[authKey] = `Bearer ${currentToken}`;
      }
    }

    const newInit = { ...init };
    if (init && init.headers) {
      newInit.headers = headers;
    }

    let response: Response;
    try {
      response = await originalFetch(input, newInit);
    } catch (error) {
      return Promise.reject(error);
    }

    if (response.status === 401) {
      let isExpiredMessage = false;
      try {
        const clone = response.clone();
        const body = await clone.json();
        if (body && (body.message === 'Access token expired' || (typeof body.message === 'string' && body.message.toLowerCase().includes('expired')))) {
          isExpiredMessage = true;
        }
      } catch (e) {
        // Response wasn't JSON or could not be cloned/parsed
      }

      if (isExpiredMessage) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          if (!refreshPromise) {
            refreshPromise = performRefresh().finally(() => {
              refreshPromise = null;
            });
          }

          const newToken = await refreshPromise;
          if (newToken) {
            const authKey = headers['Authorization'] ? 'Authorization' : 'authorization';
            headers[authKey] = `Bearer ${newToken}`;
            
            if (newInit.headers) {
              newInit.headers = headers;
            } else {
              newInit.headers = { [authKey]: `Bearer ${newToken}` };
            }

            if (input instanceof Request) {
              const newHeaders = new Headers(input.headers);
              newHeaders.set('Authorization', `Bearer ${newToken}`);
              const clonedRequest = new Request(input, { headers: newHeaders });
              return originalFetch(clonedRequest, newInit);
            }
            return originalFetch(input, newInit);
          } else {
            onLogout();
          }
        } else {
          onLogout();
        }
      }
    }

    return response;
  };
}

export default api;


