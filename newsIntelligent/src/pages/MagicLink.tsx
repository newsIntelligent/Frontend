import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuthRelaxed, attachAxiosAuth } from "../apis/auth";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ URL에서 token 추출 (쿼리, 해시 둘 다 지원)
  const getTokenFromUrl = (): string => {
    const queryParams = new URLSearchParams(search);
    const queryToken = queryParams.get("token");

    const hashParams = new URLSearchParams(hash.replace(/^#/, "?"));
    const hashToken = hashParams.get("token");

    return queryToken || hashToken || "";
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    console.log("🔎 현재 URL:", window.location.href);
    console.log("🔑 파싱된 토큰:", token);

    if (!token) {
      setStatus("error");
      setMsg("토큰이 없습니다.");
      return;
    }

    try {
      // ✅ accessToken 저장 (user 기본 구조 포함)
      persistAuthRelaxed(
        {
          accessToken: token,
          refreshToken: "",
          expiresInSec: 7 * 86400,
          user: { email: "", name: "" },
        },
        7
      );
      
      console.log("✅ 저장된 accessToken:", localStorage.getItem("accessToken"));
      console.log("✅ 저장된 expiresAt:", localStorage.getItem("expiresAt"));
      console.log("✅ 저장된 userInfo:", localStorage.getItem("userInfo"));

      // ✅ axios 인스턴스에 토큰 인터셉터 적용
      attachAxiosAuth(axiosInstance);

      setStatus("done");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch {
      setStatus("error");
      setMsg("로그인 처리 실패");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DEF0F0] p-4">
      <div className="bg-white rounded-[16px] shadow-md p-8 w-full max-w-[440px] text-center">
        {status === "loading" && <p>{msg}</p>}
        {status === "error" && (
          <>
            <p className="text-red-600 font-bold mb-2">링크 오류</p>
            <p className="mb-4">{msg}</p>
            <a href="/login" className="px-4 py-2 bg-[#0EA6C0] text-white rounded-md">
              로그인 페이지로
            </a>
          </>
        )}
        {status === "done" && <p>로그인 성공! 잠시 후 이동합니다…</p>}
      </div>
    </div>
  );
}
