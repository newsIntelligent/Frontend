import type { AxiosInstance } from "axios";
import axios from "axios";
import { attachAxiosAuth } from "../apis/auth";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

attachAxiosAuth(axiosInstance);
