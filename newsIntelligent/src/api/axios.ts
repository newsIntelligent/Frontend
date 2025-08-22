import type { AxiosInstance } from 'axios'
import axios from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
  },
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 항상 localStorage에서 읽음
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (옵션)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 처리 로직 (토큰 만료 시)
    if (error.response?.status === 401) {
      console.error("토큰이 만료되었거나 유효하지 않습니다.");
      // 필요하면 refreshToken 로직 추가
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;