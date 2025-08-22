import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuthRelaxed } from "../apis/auth";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("확인 중…");

  // ✅ 토큰 파싱 (쿼리, 해시 둘 다 지원)
  const getTokenFromUrl = (): string => {
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));
    return params.get("token") || "";
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    console.log("🔎 현재 URL:", window.location.href);
    console.log("🔑 파싱된 토큰:", token);

    try {
      if (!token) throw new Error("토큰이 없습니다.");

      const rememberDays = 7;

      // ✅ accessToken 무조건 저장
      localStorage.setItem("accessToken", token);
      console.log("✅ accessToken 저장됨:", localStorage.getItem("accessToken"));

      // ✅ axios에도 반영
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      console.log("✅ axios 헤더 설정 완료:", axiosInstance.defaults.headers.common.Authorization);

      // ✅ auth 상태에도 반영
      persistAuthRelaxed(
        {
          accessToken: token,
          refreshToken: "",
          expiresInSec: rememberDays * 86400,
          user: { email: "unknown", name: "사용자" },
        },
        rememberDays
      );

      setStatus("done");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message || "로그인 처리 실패");
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
