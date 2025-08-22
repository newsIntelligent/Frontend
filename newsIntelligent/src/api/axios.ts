import type { AxiosInstance } from 'axios'
import axios from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
  },
})

  const saved = localStorage.getItem("accessToken");
  if (saved) axiosInstance.defaults.headers.common.Authorization = `Bearer ${saved}`;

axiosInstance.interceptors.request.use(
  (config) => {
    // ⭐ accessToken 먼저 확인
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("auth:accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);