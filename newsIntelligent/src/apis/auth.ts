import type { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axios";
import axios from "axios";

export interface ApiEnvelope<T = unknown> {
  isSuccess: boolean;
  status?: string;
  code?: string;
  message?: string;
  result?: T;
}

export interface AuthUser {
  email: string;
  name: string;
  profileImageUrl?: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken?: string;
  expiresInSec?: number;
  user: AuthUser;
}

export interface AuthResultRelaxed {
  accessToken: string;
  refreshToken?: string;
  expiresInSec: number;
  user?: {
    email?: string;
    name?: string;
    profileImageUrl?: string;
  };
}

const ACCESS_KEY = "accessToken";
const EXPIRES_KEY = "expiresAt";
const USER_KEY = "userInfo";

const DEFAULT_DAYS = 7;
const MS = { day: 24 * 60 * 60 * 1000 };

export const persistAuthRelaxed = (
  result: { accessToken: string; refreshToken?: string; expiresInSec: number; user?: any },
  rememberDays: number
) => {
  const now = Date.now();
  const ttlMs = result.expiresInSec != null
    ? result.expiresInSec * 1000
    : rememberDays * MS.day;
  const exp = now + ttlMs;

  localStorage.setItem(ACCESS_KEY, result.accessToken);
  localStorage.setItem(EXPIRES_KEY, String(exp));
  localStorage.setItem(USER_KEY, JSON.stringify(result.user ?? {}));

  const t = result.accessToken?.trim();
  if (t) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${t}`;
    axios.defaults.headers.common.Authorization = `Bearer ${t}`; // ← 기본 axios도 반영
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.Authorization;
  }
};

export const persistAuth = (result: AuthResult, rememberDays: number = DEFAULT_DAYS) => {
  if (!result?.accessToken || !result?.user?.email) {
    console.error("Invalid auth result:", result);
    throw new Error("Invalid authentication result");
  }

  const now = Date.now();
  const ttlMs = result.expiresInSec != null
    ? result.expiresInSec * 1000
    : rememberDays * MS.day;
  const exp = now + ttlMs;

  try {
    localStorage.setItem(ACCESS_KEY, result.accessToken);
    localStorage.setItem(EXPIRES_KEY, String(exp));
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));

    const t = result.accessToken?.trim();
    if (t) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${t}`;
      axios.defaults.headers.common.Authorization = `Bearer ${t}`;
    } else {
      delete axiosInstance.defaults.headers.common.Authorization;
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error("Failed to persist auth data:", error);
    throw new Error("Failed to save authentication data");
  }
};

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getUserInfo(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isTokenExpired(): boolean {
  const exp = Number(localStorage.getItem(EXPIRES_KEY) || 0);
  if (!exp) return true;
  return Date.now() > exp;
}

export const clearAuth = (keepUserInfo = true) => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  if (!keepUserInfo) localStorage.removeItem(USER_KEY);
};

export function attachAxiosAuth(instance: AxiosInstance = axios) {
  instance.interceptors.request.use((config) => {
    const raw = getAccessToken();
    const token =
      raw && raw !== "null" && raw !== "undefined" && raw.trim() !== "" ? raw : null;

    config.headers = config.headers ?? {};

    if (token && !isTokenExpired()) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    } else {
      delete (config.headers as Record<string, string | undefined>).Authorization;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status;
      const url = err?.config?.url || '';
      
      // 이메일 변경 관련 API는 400 에러가 발생해도 로그인 유지
      const isEmailChangeAPI = url.includes('/notification-email/');
      
      // 401 Unauthorized나 403 Forbidden일 때만 로그인 풀기
      if ((status === 401 || status === 403) && !isEmailChangeAPI) {
        clearAuth(true);
        delete instance.defaults.headers.common.Authorization;
      }
      // 400 Bad Request는 비즈니스 로직 에러이므로 로그인 유지
      return Promise.reject(err);
    }
  );
}

export function hasLoginHistory(): boolean {
  return !!localStorage.getItem(USER_KEY);
}

const bootToken = localStorage.getItem(ACCESS_KEY);
if (bootToken && bootToken !== "null" && bootToken !== "undefined" && bootToken.trim() !== "") {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
  axios.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
} else {
  delete axiosInstance.defaults.headers.common.Authorization;
  delete axios.defaults.headers.common.Authorization;
}

// attach 인터셉터 초기 실행
attachAxiosAuth(axiosInstance);

type NormalizeOpts = { allowMissingAccessToken?: boolean };

function normalizeToAuthResult(payload: any, opts: NormalizeOpts = {}) {
  const { allowMissingAccessToken = false } = opts;
  const p = payload?.result ?? payload ?? {};
  const accessToken = p.accessToken;

  if (!accessToken || typeof accessToken !== "string" || accessToken.trim() === "") {
    if (!allowMissingAccessToken) {
      console.warn("Invalid or missing access token in payload");
      return undefined;
    }
    return undefined;
  }

  return {
    accessToken,
    refreshToken: p.refreshToken,
    expiresInSec: p.expiresInSec ?? p.expiresIn,
    user: p.user ?? { email: p.email, name: p.name, profileImageUrl: p.profileImageUrl },
  };
}

// 로그인 코드 발송
export const sendLoginCode = (email: string, isLogin: boolean, redirectBaseUrl?: string) => {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email format");
  }

  const url = isLogin ? "/members/login/email" : "/members/signup/email";
  const defaultRedirectBaseUrl = isLogin
    ? "https://www.newsintelligent.site/login/magic#token="
    : "https://www.newsintelligent.site/signup/magic#token=";

  return axiosInstance.post(url, {
    email,
    redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
  });
};

export const verifyLoginCode = async (
  email: string,
  code: string
): Promise<ApiEnvelope<AuthResult>> => {
  const { data } = await axiosInstance.post("/members/login/verify", { email, code });
  
  // ✅ 응답 구조 확인용 로그
  console.log("🔎 /members/login/verify 응답 데이터:", JSON.stringify(data, null, 2));

  const normalized = normalizeToAuthResult(data);

  if (normalized?.accessToken) {
    persistAuth(normalized, 7);
  }

  return {
    isSuccess: !!((data?.isSuccess ?? true) && normalized),
    status: data?.status,
    code: data?.code,
    message: data?.message,
    result: normalized as AuthResult | undefined,
  };
};

// 회원가입 코드 검증
export async function verifySignupCode(
  email: string,
  code: string
): Promise<ApiEnvelope<AuthResult>> {
  if (!email || !email.includes("@")) throw new Error("Invalid email format");
  if (!code || code.trim().length === 0) throw new Error("Code cannot be empty");

  const { data } = await axiosInstance.post("/members/signup/verify", { email, code });
  const normalized = normalizeToAuthResult(data);

  if (normalized?.accessToken) {
    persistAuth(normalized, 7); // ✅ 토큰 저장 + axios 헤더 반영
  }

  return {
    isSuccess: !!((data?.isSuccess ?? true) && normalized),
    status: data?.status,
    code: data?.code,
    message: data?.message,
    result: normalized as AuthResult | undefined,
  };
}

// 매직 링크 재전송
export const resendMagicLink = (email: string, isLogin: boolean, redirectBaseUrl?: string) => {
  const url = isLogin ? "/members/login/email" : "/members/signup/email";
  const defaultRedirectBaseUrl = isLogin
    ? "https://www.newsintelligent.site/login/magic#token="
    : "https://www.newsintelligent.site/signup/magic#token=";

  return axiosInstance.post(url, {
    email,
    redirectBaseUrl: redirectBaseUrl || defaultRedirectBaseUrl,
  });
};

// 이메일 변경 코드 발송
export const sendEmailChangeCode = (email: string, redirectBaseUrl?: string) => {
  const base =
    redirectBaseUrl ??
    `${window.location.origin}/settings/notification-email/magic#token=`;

  return axiosInstance.post("/members/notification-email/change", {
    newEmail: email,
    redirectBaseUrl: base,
  });
};

// 이메일 변경 코드 검증
export const verifyEmailChangeCode = async (
  email: string,
  code: string
): Promise<ApiEnvelope<void>> => {
  const { data } = await axiosInstance.post("/members/notification-email/verify", {
    newEmail: email,
    code,
  });
  return data;
};

// 이메일 변경 코드 재전송
export const resendEmailChangeCode = (email: string, redirectBaseUrl?: string) => {
  const base =
    redirectBaseUrl ??
    `${window.location.origin}/settings/notification-email/magic#token=`;
    
  return axiosInstance.post("/members/notification-email/change", {
    newEmail: email,
    redirectBaseUrl: base,
  });
};

// 매직 링크 verify는 프론트에서 처리
export const verifyMagicLink = async () => {
  throw new Error("verifyMagicLink API는 사용되지 않습니다. 해시(#)에서 토큰을 파싱하세요.");
};
