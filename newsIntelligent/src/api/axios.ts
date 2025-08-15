import type { AxiosInstance } from "axios";
import axios from "axios";

export const axiosInstance: AxiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
  },
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);
=======
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY || ''}`,
    }
})
>>>>>>> c847d92f7dbe05319c9733a1af37c4aaa0df1d77
