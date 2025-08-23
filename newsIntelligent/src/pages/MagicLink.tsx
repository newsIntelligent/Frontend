import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuthRelaxed } from "../apis/auth";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ 해시에서만 token 읽기
  const getHashToken = (): string => {
    const hashParams = new URLSearchParams(hash.replace(/^#/, "?"));
    return hashParams.get("token") || "";
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const tryLogin = async () => {
      try {
        const token = getHashToken();

        if (token) {
          console.log("🔑 매직링크 otpToken:", token);

          // 1️⃣ 토큰 저장 (임시 로그인용, refreshToken 없음)
          persistAuthRelaxed(
            {
              accessToken: token,
              refreshToken: "",
              expiresInSec: 7 * 86400,
              user: {}, 
            },
            7
          );

          // 2️⃣ axios 기본 헤더 업데이트
          localStorage.setItem("accessToken", token);
          axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

          // 3️⃣ 서버에서 userInfo 가져오기
          try {
            console.log("🔑 최종 저장된 otpToken:", localStorage.getItem("accessToken"));

            const res = await axiosInstance.get("/members/info");
            console.log("📡 /members/info 응답 전체:", res);

            const data = res.data;
            const user =
              data?.result ??
              data?.user ??
              data ?? {};

            console.log("🙋 최종 userInfo 저장:", user);

            localStorage.setItem("userInfo", JSON.stringify(user));
          } catch (err) {
            console.error("❌ 유저 정보 불러오기 실패:", err);
          }

          setStatus("done");
          setTimeout(() => navigate("/", { replace: true }), 800);
          return;
        }

        setStatus("error");
        setMsg("해시에서 토큰을 찾을 수 없습니다.");
      } catch (err) {
        console.error("로그인 처리 실패:", err);
        setStatus("error");
        setMsg("로그인 처리 실패");
      }
    };

    tryLogin();
  }, [hash, navigate]);

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

