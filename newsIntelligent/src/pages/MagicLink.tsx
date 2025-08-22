// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();

  const parseTokenFromHash = (h: string): string => {
    if (!h) return "";
    const raw = h.startsWith("#") ? h.slice(1) : h;
    const params = new URLSearchParams(raw);
    return params.get("token") || raw.replace(/^token=/, "").split("&")[0] || "";
  };

  const parseTokenFromSearch = (s: string): string => {
    if (!s) return "";
    const params = new URLSearchParams(s);
    return params.get("token") || "";
  };

  const token = parseTokenFromHash(hash) || parseTokenFromSearch(search) || "";

  const mode: Mode | null =
    pathname.startsWith("/login/magic") ? "login" :
    pathname.startsWith("/signup/magic") ? "signup" :
    pathname.startsWith("/settings/notification-email/magic") ? "notification-email" :
    null;

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [msg, setMsg] = useState("확인 중…");
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

        // 서버 magic 엔드포인트로 바로 리다이렉트
        const apiBase = "https://api.newsintelligent.site/api/members";
        const target =
          mode === "login"
            ? `${apiBase}/login/magic?token=${token}`
            : mode === "signup"
            ? `${apiBase}/signup/magic?token=${token}`
            : `${apiBase}/notification-email/magic?token=${token}`;

        window.location.href = target;
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message || "로그인 처리 중 오류가 발생했습니다.");
      }
    })();
  }, [mode, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEF0F0] p-4">
      <div className="bg-white rounded-[16px] shadow-md p-8 w-full max-w-[440px] text-center">
        {status === "loading" && (
          <>
            <div className="text-xl font-semibold mb-2">확인 중…</div>
            <p className="text-gray-600">{msg}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-xl font-semibold text-red-600 mb-2">링크 오류</div>
            <p className="text-gray-600 mb-4">{msg}</p>
            <a
              href="/login"
              className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white"
            >
              로그인 페이지로
            </a>
          </>
        )}
      </div>
    </div>
  );
}
