// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import axios from 'axios'
import { axiosInstance } from './api/axios'
import { attachAxiosAuth } from './apis/auth'

// ✅ 전역 axios 인스턴스 + 기본 axios 모두에 인터셉터 1회 장착
attachAxiosAuth(axiosInstance)
attachAxiosAuth(axios)

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
