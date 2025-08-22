import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../api/axios";

async function exchangeToken(flow: "login" | "signup" | "notification-email", token: string) {
  // 모드별 교환 엔드포인트 추정
  const base =
    flow === "signup"
      ? "/members/signup/magic"
      : flow === "notification-email"
      ? "/members/notification-email/magic"
      : "/members/login/magic";

  // 1) POST { token } 시도
  try {
    const { data } = await axiosInstance.post(base, { token });
    return data; // ApiEnvelope<AuthResult> 형태 가정
  } catch {
    // 2) 어떤 백엔드는 GET ?token=...을 사용하므로 폴백
    const { data } = await axiosInstance.get(`${base}?token=${encodeURIComponent(token)}`);
    return data;
  }
}

export default function MagicLink() {
  const nav = useNavigate();
  const loc = useLocation();
  const [msg, setMsg] = useState("인증 진행 중...");

  useEffect(() => {
  (async () => {
    try {
      // 1) 토큰 추출
      const hash = (window.location.hash || "").replace(/^#/, "");
      const tokenFromHash = new URLSearchParams(hash).get("token");
      const tokenFromQuery = new URLSearchParams(window.location.search).get("token");

      // ✅ 문자열로 확정된 변수만 이후에 사용
      let tokenStr: string | null = (tokenFromHash ?? tokenFromQuery)?.trim() ?? null;
      if (!tokenStr) {
        setMsg("유효하지 않은 링크입니다. (토큰 없음)");
        return;
      }

      // 2) 플로우 판별
      const flow: "login" | "signup" | "notification-email" =
        loc.pathname.includes("signup")
          ? "signup"
          : loc.pathname.includes("notification-email")
          ? "notification-email"
          : "login";

      // 3) JWT 아니면 교환
      if (tokenStr.split(".").length !== 3) {
        setMsg("토큰 교환 중...");
        const envelope = await exchangeToken(flow, tokenStr);
        const accessToken: string | undefined =
          envelope?.result?.accessToken || envelope?.accessToken;

        if (!accessToken) {
          throw new Error(envelope?.message || "토큰 교환 실패");
        }
        tokenStr = accessToken; // 여기서도 string 확정
      }

      // 4) 전역 헤더 + 로컬 저장 (tokenStr은 이제 'string')
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${tokenStr}`;
      localStorage.setItem("accessToken", tokenStr);

      // 5) 리다이렉트
      setMsg("인증 완료! 이동합니다...");
      const to = flow === "notification-email" ? "/settings/change" : "/";
      setTimeout(() => nav(to, { replace: true }), 300);
    } catch (err: any) {
      console.error(err);
      setMsg(`인증 실패: ${err?.message || "서버 오류"}`);
    }
  })();
}, [loc.pathname, nav]);


  return <div style={{ padding: 24 }}>{msg}</div>;
}
