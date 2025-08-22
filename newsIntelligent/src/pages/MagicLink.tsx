// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

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

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

        // 유저 정보 가져오기 (Authorization 헤더 직접 세팅)
        const res = await axiosInstance.get("/members/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res.data.result;

        const rememberDays = 7;
        persistAuth(
          {
            accessToken: token,
            refreshToken: "", // 타입상 string | undefined 이어서 ""로 처리
            expiresInSec: rememberDays * 86400,
            user, // user.email 반드시 있어야 통과
          },
          rememberDays
        );

        setStatus("done");
        setTimeout(() => {
          navigate(
            mode === "notification-email" ? "/settings?emailUpdated=1" : "/",
            { replace: true }
          );
        }, 400);
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
            <a
              href="/login"
              className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white"
            >
              로그인 페이지로
            </a>
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
