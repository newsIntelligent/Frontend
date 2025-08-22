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
    const token = localStorage.getItem("accessToken");

    if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
      // ⭐ 로그인한 경우 accessToken 으로 덮어쓰기
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ⭐ 로그인 안 한 경우에는 기본값(VITE_API_KEY)이 그대로 유지됨

    return config;
  },
  (error) => Promise.reject(error)
);