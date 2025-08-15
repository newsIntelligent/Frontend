// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { type ApiEnvelope, type AuthResult, persistAuth, verifyMagicLink } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

export default function MagicLink() {
  const [params] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const token = params.get("token") || "";

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

        const resp: ApiEnvelope<AuthResult> = await verifyMagicLink(mode, token);
        if (!resp?.isSuccess || !resp?.result?.accessToken) {
          throw new Error(resp?.message || "매직 링크 검증 실패");
        }

        const { accessToken, refreshToken, expiresInSec, user } = resp.result;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        const rememberDays = 7;
        persistAuth(
          {
            accessToken,
            refreshToken,
            expiresInSec: expiresInSec ?? rememberDays * 86400,
            user: { email: user.email, name: user.name || user.email.split("@")[0], profileImageUrl: user.profileImageUrl },
          },
          rememberDays
        );

        setStatus("done");
        // 성공 시 /settings로 이동
        navigate(mode === "notification-email" ? "/settings?emailUpdated=1" : "/settings", { replace: true });
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
