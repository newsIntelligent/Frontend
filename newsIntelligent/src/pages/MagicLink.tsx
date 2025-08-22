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
      
      persistAuthRelaxed(
        {
          accessToken: token,
          refreshToken: "",
          expiresInSec: rememberDays * 86400,
          user: {
            email: "",
            name: "",
            profileImageUrl: undefined,
          },
        },
        rememberDays
      );

      // ✅ axios 헤더에도 즉시 반영
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setStatus("done");
      setTimeout(() => {
        navigate(
          mode === "notification-email"
            ? "/settings?emailUpdated=1"
            : "/",
          { replace: true }
        );
      }, 400);
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message || "로그인 처리 중 오류가 발생했습니다.");
    }
  })();
}, [loc.pathname, nav]);


  return <div style={{ padding: 24 }}>{msg}</div>;
}
