// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();
  const once = useRef(false);
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [msg, setMsg] = useState("확인 중…");

  const parseToken = (s: string) => {
    const raw = s.startsWith("#") ? s.slice(1) : s;
    return new URLSearchParams(raw).get("token") || "";
  };

  const token = parseToken(hash) || parseToken(search) || "";
  const mode = pathname.includes("/signup/magic")
    ? "signup"
    : pathname.includes("/login/magic")
    ? "login"
    : null;

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    if (!mode || !token) {
      setStatus("error");
      setMsg("잘못된 링크입니다 (mode/token 누락).");
      return;
    }

    try {
      // 백엔드 매직 링크 인증 엔드포인트로 리다이렉트
      window.location.href = `https://api.newsintelligent.site/api/members/${mode}/magic?token=${token}`;
    } catch (e: any) {
      setStatus("error");
      setMsg(e.message || "로그인 처리 중 오류가 발생했습니다.");
    }
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
