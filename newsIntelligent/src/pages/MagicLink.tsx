// src/pages/MagicLink.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { persistAuth, verifyLoginCode, verifySignupCode, verifyEmailChangeCode } from "../apis/auth";

type Mode = "login" | "signup" | "notification-email";

function pickParamAll(href: string, key: string): string {
  if (!href) return "";
  const url = new URL(href);
  const fromSearch = url.searchParams.get(key) || "";
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const hashParams = new URLSearchParams(hash);
  const fromHash = hashParams.get(key) || "";
  const fromRegex = (() => {
    const m = href.match(new RegExp(`[#?&]${key}=([^&#]+)`));
    return m?.[1] ?? "";
  })();
  return decodeURIComponent(fromSearch || fromHash || fromRegex).trim();
}

function pickMode(href: string): Mode | null {
  if (/\/login\/magic(?:$|[?#/])/.test(href) || /(?:^|[#?&])mode=login/.test(href)) return "login";
  if (/\/signup\/magic(?:$|[?#/])/.test(href) || /(?:^|[#?&])mode=signup/.test(href)) return "signup";
  if (/\/settings\/notification-email\/magic(?:$|[?#/])/.test(href) || /(?:^|[#?&])mode=notification-email/.test(href)) {
    return "notification-email";
  }
  return null;
}

const EMAIL_KEYS = [
  "email",
  "e",
  "authEmail",
  "newEmail",
  "pendingEmail",
  "pendingNewEmail",
  "loginEmail",
  "signupEmail",
  "notificationEmail",
];

function loadEmailFallback(): string {
  // 여러 키 후보를 순회하며 localStorage에서 이메일 추정
  for (const k of EMAIL_KEYS) {
    const v = localStorage.getItem(`auth:${k}`) || localStorage.getItem(k);
    if (v && /\S+@\S+\.\S+/.test(v)) return v;
  }
  return "";
}

export default function MagicLink() {
  const navigate = useNavigate();
  const href = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);
  const [status, setStatus] = useState<"loading" | "input" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");
  const [manualEmail, setManualEmail] = useState("");

  const tokenRef = useRef("");
  const modeRef = useRef<Mode | null>(null);
  const emailRef = useRef("");

  // 1) URL에서 token/mode/email 추출 + localStorage 보강
  useEffect(() => {
    if (!href) return;

    const token = pickParamAll(href, "token") || pickParamAll(href, "code") || pickParamAll(href, "t");
    const mode = pickMode(href);
    const urlEmail =
      pickParamAll(href, "email") || pickParamAll(href, "e") || pickParamAll(href, "newEmail") || pickParamAll(href, "authEmail");
    const fallbackEmail = loadEmailFallback();

    tokenRef.current = token;
    modeRef.current = mode;
    emailRef.current = urlEmail || fallbackEmail;

    if (!mode || !token) {
      setStatus("error");
      setMsg("잘못된 링크입니다 (mode/token 누락).");
      return;
    }

    // 로그인/회원가입은 서버 검증에 email이 필요
    if ((mode === "login" || mode === "signup" || mode === "notification-email") && !emailRef.current) {
      setStatus("input");
      setMsg("이메일을 입력하면 인증을 완료할 수 있어요.");
      return;
    }

    setStatus("loading");
  }, [href]);

  // 2) 서버 검증 → persistAuth
  useEffect(() => {
    const run = async () => {
      if (status !== "loading") return;
      const token = tokenRef.current;
      const mode = modeRef.current;
      const email = emailRef.current;

      try {
        if (!mode || !token) throw new Error("잘못된 링크입니다 (mode/token 누락).");

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
          // 메일 변경은 세션 유지와 별개일 수 있으니 홈/세팅으로 이동만
        }

        setStatus("done");
        setMsg("인증 완료! 잠시 후 이동합니다…");
        setTimeout(() => {
          if (mode === "notification-email") navigate("/settings?emailUpdated=1", { replace: true });
          else navigate("/", { replace: true });
        }, 500);
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message || "로그인 처리 중 오류가 발생했습니다.");
      }
    };
    run();
  }, [navigate, status]);

  // 3) 이메일 수동 입력 처리
  const onManualSubmit = async () => {
    const v = manualEmail.trim();
    if (!/\S+@\S+\.\S+/.test(v)) {
      setMsg("올바른 이메일을 입력해 주세요.");
      return;
    }
    // 다음부터 자동 인식을 위해 저장
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

        {status === "input" && (
          <>
            <div className="text-xl font-semibold mb-3">이메일 확인 필요</div>
            <p className="text-gray-600 mb-4">메일을 보냈던 주소를 입력해 주세요. 토큰과 함께 서버에서 검증해요.</p>
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 border rounded px-3 py-2 text-sm"
                placeholder="you@example.com"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
              />
              <button className="px-3 py-2 rounded bg-[#0EA6C0] text-white text-sm" onClick={onManualSubmit}>
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
