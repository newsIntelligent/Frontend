// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  const parseToken = (): string => {
    const s = new URLSearchParams(search).get("token");
    if (s) return decodeURIComponent(s).trim();

    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    if (raw) {
      const p = new URLSearchParams(raw);
      const h = p.get("token") || (raw.startsWith("token=") ? raw.slice(6).split("&")[0] : "");
      if (h) return decodeURIComponent(h).trim();
    }

    const m = (typeof window !== "undefined" ? window.location.href : "").match(/[#?]token=([^&#]+)/);
    return m ? decodeURIComponent(m[1]).trim() : "";
  };

  const token = parseToken();

  const mode: Mode | null =
    pathname.includes("/login/magic") ? "login" :
    pathname.includes("/signup/magic") ? "signup" :
    pathname.includes("/settings/notification-email/magic") ? "notification-email" :
    null;

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

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
        setMsg("로그인되었습니다. 잠시 후 이동합니다…");
        setTimeout(() => {
          navigate(mode === "notification-email" ? "/settings?emailUpdated=1" : "/", { replace: true });
        }, 500);
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message || "로그인 처리 중 오류가 발생했습니다.");
      }
    })();
  }, [mode, navigate, token]);

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
            <a href="/login" className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white">로그인 페이지로</a>
          </>
        )}
        {status === "done" && (
          <>
            <div className="text-xl font-semibold mb-2">완료!</div>
            <p className="text-gray-600">잠시 후 이동합니다…</p>
          </>
        )}
      </div>
    </div>
  );
}

