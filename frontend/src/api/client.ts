import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth-store';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
});

const refreshClient = axios.create({ baseURL });

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async () => {
  const { refreshToken, updateTokens } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  try {
    const { data } = await refreshClient.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken },
    );

    updateTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });

    refreshQueue.forEach((callback) => callback(data.accessToken));
    refreshQueue = [];

    return data.accessToken;
  } finally {
    isRefreshing = false;
  }
};

export const withAuthHeaders = () => {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
