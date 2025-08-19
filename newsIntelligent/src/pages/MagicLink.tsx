// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  // 해시에서 토큰 파싱
  const parseTokenFromHash = (h: string): string => {
    if (!h) return "";
    const raw = h.startsWith("#") ? h.slice(1) : h;
    const params = new URLSearchParams(raw);
    return params.get("token") || raw.replace(/^token=/, "").split("&")[0] || "";
  };
  const token = parseTokenFromHash(hash);

  // 경로로 mode 판단: /login/magic | /signup/magic | /settings/notification-email/magic
  const mode: Mode | null =
    pathname.startsWith("/login/magic") ? "login" :
    pathname.startsWith("/signup/magic") ? "signup" :
    pathname.startsWith("/settings/notification-email/magic") ? "notification-email" :
    null;

  const [msg, setMsg] = useState("매직 링크 확인 중…");
  const [status, setStatus] = useState<"loading"|"done"|"error">("loading");
  const guard = useRef(false);

  useEffect(() => {
    if (guard.current) return;
    guard.current = true;

    (async () => {
      try {
        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

        // 백엔드가 리다이렉트로 전달한 토큰을 그대로 저장
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

        const rememberDays = 7;
        persistAuth(
          {
            accessToken: token,
            refreshToken: undefined,
            expiresInSec: rememberDays * 86400,
            user: { email: "", name: "", profileImageUrl: undefined },
          },
          rememberDays
        );

        setStatus("done");
        // 성공 시 이동 경로: 로그인/회원가입 → 홈, 이메일 변경 → settings
        navigate(
          mode === "notification-email" ? "/settings?emailUpdated=1" : "/",
          { replace: true }
        );
      } catch (e: any) {
        console.error(e);
        setStatus("error");
        setMsg(e?.message || "오류가 발생했습니다.");
      }
    })();
  }, [mode, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEF0F0] p-4">
      <div className="bg-white rounded-[16px] shadow-md p-8 w-full max-w-[440px] text-center">
        {status === "loading" && (<><div className="text-xl font-semibold mb-2">확인 중…</div><p className="text-gray-600">{msg}</p></>)}
        {status === "error" && (<>
          <div className="text-xl font-semibold text-red-600 mb-2">링크 오류</div>
          <p className="text-gray-600 mb-4">{msg}</p>
          <a href="/login" className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white">로그인 페이지로</a>
        </>)}
        {status === "done" && (<><div className="text-xl font-semibold mb-2">완료!</div><p className="text-gray-600">잠시 후 이동합니다…</p></>)}
      </div>
    </div>
  );
}
