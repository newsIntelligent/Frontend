// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

const pick = (href: string, key: string) => {
  const u = new URL(href);
  const fromSearch = u.searchParams.get(key) || "";
  const hash = u.hash.startsWith("#") ? u.hash.slice(1) : u.hash;
  const fromHash = new URLSearchParams(hash).get(key) || "";
  const m = href.match(new RegExp(`[#?&]${key}=([^&#]+)`));
  const fromRegex = m?.[1] ?? "";
  return decodeURIComponent(fromSearch || fromHash || fromRegex).trim();
};

export default function MagicLink() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const href = typeof window !== "undefined" ? window.location.href : "";

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");

  const tokenRef = useRef("");
  const modeRef = useRef<Mode | null>(null);

  useEffect(() => {
    const token = pick(href, "token") || pick(href, "code") || pick(href, "t");
    const mode: Mode | null =
      pathname.includes("/login/magic") ? "login" :
      pathname.includes("/signup/magic") ? "signup" :
      pathname.includes("/settings/notification-email/magic") ? "notification-email" :
      null;

    tokenRef.current = token;
    modeRef.current = mode;

    if (!mode || !token) {
      setStatus("error");
      setMsg("잘못된 링크입니다 (mode/token 누락).");
      return;
    }

    (async () => {
      try {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

        const { data } = await axiosInstance.get("/members/info");
        const r: any = data?.result ?? data;
        const user = {
          email: r?.email ?? "",
          name: r?.nickname ?? r?.name ?? "",
          profileImageUrl: r?.profileImageUrl,
        };

        persistAuth({ accessToken: token, user }, 7);

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
  }, [href, navigate, pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEF0F0] p-4">
      <div className="bg-white rounded-[16px] shadow-md p-8 w-full max-w-[520px] text-center">
        {status === "loading" && (
          <>
            <div className="text-xl font-semibold mb-2">확인 중…</div>
            <p className="text-gray-600">{msg}</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-xl font-semibold text-red-600 mb-2">링크 오류</div>
            <p className="text-gray-600 mb-4 break-all">{msg}</p>
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
