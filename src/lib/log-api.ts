import axios, { type AxiosError, type AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_API_LIVE;

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

// Token Management
export const getToken = (): string | null => localStorage.getItem('qm_auth_token');
export const setToken = (token: string): void => localStorage.setItem('qm_auth_token', token);
export const removeToken = (): void => localStorage.removeItem('qm_auth_token');

// Axios Instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {

    // solve the image file upload issue 
    if (config.data instanceof FormData) {
      if (config.headers && typeof (config.headers as any).set === 'function') {
        (config.headers as any).set('Content-Type', undefined);
      } else if (config.headers) {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    }
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // If the error is a 401 Unauthorized, and it wasn't the login endpoint itself that failed 
    // (meaning an active session suddenly expired), we force a logout.
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      removeToken();
      window.location.href = '/login';
    }

    const responseData = error.response?.data as { message?: string, error?: string } | undefined;
    const message = responseData?.message || responseData?.error || error.message || 'An error occurred during the request';

    throw new ApiError(
      error.response?.status || 500,
      message,
      responseData
    );
  }
);

// Core Request Function
const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(error instanceof Error ? error.message : 'Network error');
  }
};

// HTTP Methods
const get = async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
  const response = await axiosInstance.get<T>(endpoint, options);
  return response.data;
};

const post = async <T, D = unknown>(endpoint: string, data?: D, options?: RequestOptions): Promise<T> => {
  const response = await axiosInstance.post<T>(endpoint, data, options);
  return response.data;
};

const put = async <T, D = unknown>(endpoint: string, data?: D, options?: RequestOptions): Promise<T> => {
  const response = await axiosInstance.put<T>(endpoint, data, options);
  return response.data;
};

const patch = async <T, D = unknown>(endpoint: string, data?: D, options?: RequestOptions): Promise<T> => {
  const response = await axiosInstance.patch<T>(endpoint, data, options);
  return response.data;
};

const del = async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
  const response = await axiosInstance.delete<T>(endpoint, options);
  return response.data;
};

// Group into an api object to maintain compatibility with existing imports
export const apiForLogs = {
  getToken,
  setToken,
  removeToken,
  request,
  get,
  post,
  put,
  patch,
  delete: del,
};
