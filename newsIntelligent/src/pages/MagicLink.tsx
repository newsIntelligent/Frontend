import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuthRelaxed } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const parseToken = (raw: string): string => {
    if (!raw) return "";
    const cleaned = raw.startsWith("#") ? raw.slice(1) : raw;
    const params = new URLSearchParams(cleaned);
    return params.get("token") || cleaned.replace(/^token=/, "").split("&")[0] || "";
  };

  const token = parseToken(hash) || parseToken(search);
  const mode: Mode | null =
    pathname.startsWith("/login/magic") ? "login" :
    pathname.startsWith("/signup/magic") ? "signup" :
    pathname.startsWith("/settings/notification-email/magic") ? "notification-email" :
    null;

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    try {
      if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

      const rememberDays = 7;

      persistAuthRelaxed(
        {
          accessToken: token,
          refreshToken: "",
          expiresInSec: rememberDays * 86400,
          user: {}, // 매직링크 초기 단계에서는 비워둠
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
