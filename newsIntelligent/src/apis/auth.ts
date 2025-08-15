import type { AxiosInstance } from 'axios'
import { axiosInstance } from '../api/axios'
import axios from 'axios'

// 공용 응답 envelope & 로그인 결과 타입
export interface ApiEnvelope<T = unknown> {
  isSuccess: boolean
  status?: string
  code?: string
  message?: string
  result?: T
}

export interface AuthUser {
  email: string
  name: string
  profileImageUrl?: string
}

export interface AuthResult {
  accessToken: string
  refreshToken?: string
  expiresInSec?: number
  user: AuthUser
}

const ACCESS_KEY = 'accessToken'
const EXPIRES_KEY = 'expiresAt'
const USER_KEY = 'userInfo'

const DEFAULT_DAYS = 7 // 7일동안 유효
const MS = { day: 24 * 60 * 60 * 1000 }

// 토큰/유저 정보 저장
export const persistAuth = (result: AuthResult, rememberDays: number = DEFAULT_DAYS) => {
  // 입력값 검증
  if (!result?.accessToken || !result?.user?.email) {
    console.error('Invalid auth result:', result)
    throw new Error('Invalid authentication result')
  }

  const now = Date.now()
  const ttlMs = result.expiresInSec != null ? result.expiresInSec * 1000 : rememberDays * MS.day
  const exp = now + ttlMs

  try {
    localStorage.setItem(ACCESS_KEY, result.accessToken)
    localStorage.setItem(EXPIRES_KEY, String(exp))
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))

    // 토큰 값 검증 후 axiosInstance 헤더 반영
    const t = result.accessToken
    if (t && t !== 'null' && t !== 'undefined' && t.trim() !== '') {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${t}`
    } else {
      delete axiosInstance.defaults.headers.common.Authorization
    }
  } catch (error) {
    console.error('Failed to persist auth data:', error)
    throw new Error('Failed to save authentication data')
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY)
}

export function getUserInfo(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isTokenExpired(): boolean {
  const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0)
  if (!exp) return true
  return Date.now() > exp
}

// 로그아웃
export const clearAuth = (keepUserInfo = true) => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(EXPIRES_KEY)
  if (!keepUserInfo) localStorage.removeItem(USER_KEY)
}

// Axios 인스턴스 부착
export function attachAxiosAuth(instance: AxiosInstance = axios) {
  instance.interceptors.request.use((config) => {
    const raw = getAccessToken()
    const token = raw && raw !== 'null' && raw !== 'undefined' && raw.trim() !== '' ? raw : null

    config.headers = config.headers ?? {}

    if (token && !isTokenExpired()) {
      ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
    } else {
      // 🔑 토큰이 없거나 이상하면 헤더 자체를 제거 (Bearer만 나가던 문제 방지)
      delete (config.headers as Record<string, string | undefined>).Authorization
    }
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err?.response?.status === 401) {
        clearAuth(true)
        // 401 이후에도 헤더가 남아있지 않도록 방어
        delete instance.defaults.headers.common.Authorization
      }
      return Promise.reject(err)
    }
  )
}

export function hasLoginHistory(): boolean {
  return !!localStorage.getItem(USER_KEY)
}

// 저장된 토큰 헤더 적용
const bootToken = localStorage.getItem('accessToken')
if (bootToken && bootToken !== 'null' && bootToken !== 'undefined' && bootToken.trim() !== '') {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${bootToken}`
} else {
  delete axiosInstance.defaults.headers.common.Authorization
}

type NormalizeOpts = { allowMissingAccessToken?: boolean }

// 응답 정규화
function normalizeToAuthResult(payload: any, opts: NormalizeOpts = {}) {
  const { allowMissingAccessToken = false } = opts
  const p = payload?.result ?? payload ?? {}
  const accessToken = p.accessToken

  if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
    if (!allowMissingAccessToken) {
      console.warn('Invalid or missing access token in payload')
      return undefined // 또는 throw new Error('MISSING_ACCESS_TOKEN')
    }
    // 토큰 없어도 통과 (회원가입 검증 성공 케이스 지원)
    return undefined
  }

  return {
    accessToken,
    refreshToken: p.refreshToken,
    expiresInSec: p.expiresInSec ?? p.expiresIn,
    user: p.user ?? { email: p.email, name: p.name, profileImageUrl: p.profileImageUrl },
  }
}

// 로그인/회원가입 인증 코드 전송
export const sendLoginCode = (email: string, isLogin: boolean, redirectBaseUrl?: string) => {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format')
  }

  try {
    const url = isLogin ? '/members/login/email' : '/members/signup/email'
    const defaultRedirectBaseUrl = isLogin
      ? 'https://www.newsintelligent.site/login/magic?token='
      : 'https://www.newsintelligent.site/signup/magic?token='

    return axiosInstance.post(url, {
      email,
      redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
    })
  } catch (error) {
    console.error('Failed to send login code:', error)
    throw error
  }
}

// 로그인 인증 코드 검증
export const verifyLoginCode = async (
  email: string,
  code: string
): Promise<ApiEnvelope<AuthResult>> => {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email format')
  }
  if (!code || code.trim().length === 0) {
    throw new Error('Code cannot be empty')
  }

  try {
    const { data } = await axiosInstance.post('/members/login/verify', { email, code })
    const normalized = normalizeToAuthResult(data)

    return {
      isSuccess: !!((data?.isSuccess ?? true) && normalized),
      status: data?.status,
      code: data?.code,
      message: data?.message,
      result: normalized as AuthResult | undefined,
    }
  } catch (error) {
    console.error('Failed to verify login code:', error)
    throw error
  }
}

// 회원가입 인증 코드 검증
export async function verifySignupCode(email: string, code: string) {
  const { data } = await axiosInstance.post('/members/signup/verify', { email, code })
  // ✅ 토큰이 없어도 성공으로 처리되게
  const result = normalizeToAuthResult(data, { allowMissingAccessToken: true })
  return { isSuccess: true, result, message: data?.message, code: data?.code } as ApiEnvelope<
    AuthResult | undefined
  >
}

// 로그인/회원가입 코드 재요청
export const resendMagicLink = (email: string, isLogin: boolean, redirectBaseUrl?: string) => {
  const url = isLogin ? '/members/login/magic' : '/members/signup/magic'
  const defaultRedirectBaseUrl = isLogin
    ? 'https://www.newsintelligent.site/login/magic?token='
    : 'https://www.newsintelligent.site/signup/magic?token='

  return axiosInstance.post(url, {
    email,
    redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
  })
}

// 이메일 변경 코드 전송
export const sendEmailChangeCode = (email: string, redirectBaseUrl?: string) => {
  const defaultRedirectBaseUrl =
    'https://www.newsintelligent.site/settings/notification-email/magic?token='

  return axiosInstance.post('/members/notification-email/change', {
    email,
    redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
  })
}

// 이메일 변경 코드 검증
export const verifyEmailChangeCode = async (
  email: string,
  code: string
): Promise<ApiEnvelope<void>> => {
  const { data } = await axiosInstance.post('/members/notification-email/verify', {
    email,
    code,
  })
  return data
}

//이메일 변경 코드 재전송
export const resendEmailChangeCode = (email: string, redirectBaseUrl?: string) => {
  const defaultRedirectBaseUrl =
    'https://www.newsintelligent.site/settings/notification-email/magic?token='

  return axiosInstance.post('/members/notification-email/magic', {
    email,
    redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
  })
}

// 매직 링크 검증
export const verifyMagicLink = async (
  mode: 'login' | 'signup' | 'notification-email',
  token: string
) => {
  const resp = await axiosInstance.post('/api/auth/magic/verify', { mode, token })
  return resp.data // ApiEnvelope<AuthResult>
}
