// src/pages/MagicLink.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuth, verifyLoginCode, verifySignupCode, verifyEmailChangeCode } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());

const pickParam = (href: string, key: string) => {
  const u = new URL(href);
  const fromSearch = u.searchParams.get(key) || "";
  const rawHash = u.hash.startsWith("#") ? u.hash.slice(1) : u.hash;
  const fromHash = new URLSearchParams(rawHash).get(key) || "";
  const m = href.match(new RegExp(`[#?&]${key}=([^&#]+)`));
  const fromRegex = m?.[1] ?? "";
  return decodeURIComponent(fromSearch || fromHash || fromRegex).trim();
};

const pickToken = (href: string) =>
  pickParam(href, "token") || pickParam(href, "code") || pickParam(href, "t");

const pickEmail = (href: string) =>
  pickParam(href, "email") ||
  pickParam(href, "newEmail") ||
  pickParam(href, "e");

const loadEmailFallback = () => {
  const keys = [
    "auth:pendingEmail",
    "auth:loginEmail",
    "auth:signupEmail",
    "auth:newEmail",
    "pendingEmail",
    "loginEmail",
    "signupEmail",
    "newEmail",
    "email",
  ];
  for (const k of keys) {
    const v = localStorage.getItem(k) || "";
    if (isValidEmail(v)) return v.trim();
  }
  return "";
};

export default function MagicLink() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const href = typeof window !== "undefined" ? window.location.href : "";
  const mode: Mode | null =
    pathname.includes("/login/magic") ? "login" :
    pathname.includes("/signup/magic") ? "signup" :
    pathname.includes("/settings/notification-email/magic") ? "notification-email" :
    null;

  const tokenRef = useRef("");
  const emailRef = useRef("");

  const [status, setStatus] = useState<"loading" | "need-email" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const token = pickToken(href);
    const emailFromUrl = pickEmail(href);
    const emailFallback = loadEmailFallback();

    tokenRef.current = token;
    emailRef.current = (emailFromUrl || emailFallback || "").trim();

    if (!mode || !token) {
      setStatus("error");
      setMsg("잘못된 링크입니다 (mode/token 누락).");
      return;
    }

    if (!isValidEmail(emailRef.current)) {
      setStatus("need-email");
      setMsg("이메일을 입력하면 인증을 완료할 수 있어요.");
      return;
    }

    setStatus("loading");
  }, [href, mode]);

  useEffect(() => {
    const run = async () => {
      if (status !== "loading") return;
      try {
        const token = tokenRef.current;
        const email = emailRef.current;

        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");
        if (!isValidEmail(email)) {
          setStatus("need-email");
          setMsg("이메일 형식이 올바르지 않습니다.");
          return;
        }

        if (mode === "login") {
          const { isSuccess, result, message } = await verifyLoginCode(email, token);
          if (!isSuccess || !result) throw new Error(message || "로그인 코드 검증 실패");
          persistAuth(result);
        } else if (mode === "signup") {
          const { isSuccess, result, message } = await verifySignupCode(email, token);
          if (!isSuccess || !result) throw new Error(message || "회원가입 코드 검증 실패");
          persistAuth(result);
        } else if (mode === "notification-email") {
          const { isSuccess, message } = await verifyEmailChangeCode(email, token);
          if (!isSuccess) throw new Error(message || "이메일 변경 검증 실패");
        }

        setStatus("done");
        setMsg("인증 완료! 잠시 후 이동합니다…");
        setTimeout(() => {
          navigate(mode === "notification-email" ? "/settings?emailUpdated=1" : "/", { replace: true });
        }, 500);
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message || "로그인 처리 중 오류가 발생했습니다.");
      }
    };
    run();
  }, [mode, navigate, status]);

  const submitEmail = () => {
    if (!isValidEmail(emailInput)) {
      setMsg("올바른 이메일을 입력해 주세요.");
      return;
    }
    const v = emailInput.trim();
    localStorage.setItem("auth:pendingEmail", v);
    emailRef.current = v;
    setStatus("loading");
    setMsg("확인 중…");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEF0F0] p-4">
      <div className="bg-white rounded-[16px] shadow-md p-8 w-full max-w-[520px] text-center">
        {status === "loading" && (
          <>
            <div className="text-xl font-semibold mb-2">확인 중…</div>
            <p className="text-gray-600">{msg}</p>
          </>
        )}
        {status === "need-email" && (
          <>
            <div className="text-xl font-semibold mb-3">이메일 확인 필요</div>
            <p className="text-gray-600 mb-4">{msg}</p>
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 border rounded px-3 py-2 text-sm"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button className="px-3 py-2 rounded bg-[#0EA6C0] text-white text-sm" onClick={submitEmail}>
                확인
              </button>
            </div>
            <a href="/login" className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white">
              로그인 페이지로
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-xl font-semibold text-red-600 mb-2">링크 오류</div>
            <p className="text-gray-600 mb-4 break-all">{msg}</p>
            <a href="/login" className="inline-block mt-2 px-4 py-2 rounded-md bg-[#0EA6C0] text-white">
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
