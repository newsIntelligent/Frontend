import type { AxiosInstance } from 'axios'
import axios from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
  },
})

const token = localStorage.getItem("auth:accessToken");
if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
} else {
  delete axiosInstance.defaults.headers.common.Authorization;
}

// ✅ 요청 인터셉터: 항상 최신 토큰을 헤더에 세팅
axiosInstance.interceptors.request.use((config) => {
  const t = localStorage.getItem("auth:accessToken");
  if (t && t !== "null" && t !== "undefined" && t.trim() !== "") {
    config.headers.Authorization = `Bearer ${t}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});