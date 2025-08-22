import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuthRelaxed } from "../apis/auth";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  const getTokenFromUrl = (): string => {
    const hashParams = new URLSearchParams(hash.replace(/^#/, "?"));
    return hashParams.get("token") || "";
  };

  const getQueryToken = (): string => {
    const queryParams = new URLSearchParams(search);
    return queryParams.get("token") || "";
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const tryLogin = async () => {
      try {
        const hashToken = getTokenFromUrl();
        const queryToken = getQueryToken();
        const code = hashToken || queryToken; // 인증 코드

        // 이메일은 로컬스토리지에 pendingEmail 로 저장해두는 게 일반적임
        const email = localStorage.getItem("auth:pendingEmail") || "";

        if (code && email) {
          console.log("🔑 매직링크 code:", code);
          console.log("📧 이메일:", email);

          // 1️⃣ verify 호출 → accessToken/refreshToken 발급
          const verifyRes = await axiosInstance.post("/members/login/verify", {
            email,
            code,
          });
          console.log("📡 verify 응답:", verifyRes.data);

          const { accessToken, refreshToken, expiresInSec, user } = verifyRes.data;

          // 2️⃣ 토큰 저장
          persistAuthRelaxed(
            { accessToken, refreshToken, expiresInSec, user },
            7
          );

          // 3️⃣ axios 헤더 갱신
          axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

          // 4️⃣ 유저 정보 저장
          localStorage.setItem("userInfo", JSON.stringify(user));

          setStatus("done");
          setTimeout(() => navigate("/", { replace: true }), 800);
          return;
        }

        setStatus("error");
        setMsg("토큰 또는 이메일이 없습니다.");
      } catch (err) {
        console.error("로그인 처리 실패:", err);
        setStatus("error");
        setMsg("로그인 처리 실패");
      }
    };

    tryLogin();
  }, [hash, search, navigate]);

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
