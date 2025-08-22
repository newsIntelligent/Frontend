import type { AxiosInstance } from 'axios'
import axios from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    // 로그인 토큰이 있으면 우선적으로 사용
    const token =
      localStorage.getItem("auth:accessToken") ||
      localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
