import { Capacitor } from '@capacitor/core';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    requestId?: string;
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;
  public isNetworkError: boolean;

  constructor(message: string, status = 0, code?: string, details?: any, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Fallback production deployment backend URL for native APK builds
const DEFAULT_PRODUCTION_API_URL = 'https://youth-sigma.vercel.app/api/v1';

class ApiClient {
  public get baseUrl(): string {
    const envUrl =
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL;

    if (envUrl && envUrl.trim() !== '') {
      let trimmed = envUrl.trim();
      // Remove trailing slash
      if (trimmed.endsWith('/')) trimmed = trimmed.slice(0, -1);
      // Normalize /api to /api/v1 if not already versioned
      if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
      return trimmed;
    }

    // When running inside native Android/iOS Capacitor WebView, relative URLs resolve to https://localhost (broken)
    if (Capacitor.isNativePlatform()) {
      return DEFAULT_PRODUCTION_API_URL;
    }

    // On web development or Vercel static web deployment, relative path routes seamlessly
    return '/api/v1';
  }

  private get defaultHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private sanitizeErrorMessage(endpoint: string, status: number, rawMsg?: string, errorCode?: string): string {
    const isAuthLoginOrRegister = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

    if (status === 401) {
      if (isAuthLoginOrRegister || errorCode === 'INVALID_CREDENTIALS') {
        return rawMsg || 'Invalid email or password. Please check your credentials.';
      }
      return 'Your session has expired. Please sign in again.';
    }

    if (status === 403) {
      if (errorCode === 'ACCOUNT_SUSPENDED') {
        return rawMsg || 'Your account has been suspended. Please contact support.';
      }
      return rawMsg || 'You do not have permission to access this resource.';
    }

    if (status === 409 && errorCode === 'EMAIL_EXISTS') {
      return rawMsg || 'An account with this email already exists.';
    }

    if (status === 404) {
      return rawMsg || 'The requested resource could not be found.';
    }

    if (status >= 500) {
      return 'Our servers encountered a temporary issue. Please try again in a moment.';
    }

    if (!rawMsg) return 'Unable to complete request. Please try again.';

    // Strip raw technical stack traces or database keywords if present
    const lower = rawMsg.toLowerCase();
    if (
      lower.includes('mongo') ||
      lower.includes('e11000') ||
      lower.includes('syntaxerror') ||
      lower.includes('casterror') ||
      lower.includes('jwt') ||
      lower.includes('bearer')
    ) {
      return 'A data validation error occurred. Please verify your inputs.';
    }

    return rawMsg;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${path}`;

    // Request Timeout Controller (15 seconds)
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), 15000);

    const config: RequestInit = {
      ...options,
      signal: options.signal || timeoutController.signal,
      headers: {
        ...this.defaultHeaders,
        ...((options.headers as Record<string, string>) || {}),
      },
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = { success: response.ok, message: response.statusText };
      }

      if (!response.ok || data.success === false) {
        const rawMsg = data.error?.message || data.message;
        const errorCode = data.error?.code;
        const cleanMsg = this.sanitizeErrorMessage(endpoint, response.status, rawMsg, errorCode);
        throw new ApiError(cleanMsg, response.status, errorCode, data.error?.details);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out. Please check your mobile connection and try again.', 408, 'REQUEST_TIMEOUT', null, true);
      }

      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch'))) {
        console.error(`Network/CORS Error [${options.method || 'GET'} ${url}]:`, error);
        const isActuallyOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
        if (isActuallyOffline) {
          throw new ApiError('No internet connection. Please check your network and try again.', 0, 'OFFLINE', null, true);
        }
        throw new ApiError('Unable to connect to server. Please try again in a moment.', 0, 'CONNECTION_ERROR', null, false);
      }

      console.error(`API Client Error [${options.method || 'GET'} ${url}]:`, error);
      throw new ApiError(error.message || 'An unexpected error occurred.', 0, 'UNKNOWN_ERROR');
    }
  }

  public get<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public patch<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
