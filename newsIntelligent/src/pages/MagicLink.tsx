import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";
import { persistAuth } from "../apis/auth";

export default function MagicLink() {
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ URL 에서 token 추출 (#token=... 혹은 ?token=...)
  const getTokenFromUrl = (): string => {
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));
    return params.get("token") || "";
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    if (!token) {
      setStatus("error");
      setMsg("토큰이 없습니다.");
      return;
    }

    // ✅ 백엔드 API 호출: 토큰 교환
    axiosInstance
      .get(`/members/login/magic?token=${token}`)
      .then((res) => {
        console.log("🔑 /members/login/magic 응답:", res.data);

        const result = res.data?.result;
        if (!result?.accessToken) {
          setStatus("error");
          setMsg("accessToken이 응답에 없습니다.");
          return;
        }

        // ✅ 토큰/유저 저장
        persistAuth(
          {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresInSec: result.expiresInSec ?? 604800,
            user: result.user ?? { email: result.email, name: result.name },
          },
          7
        );

        setStatus("done");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
      })
      .catch((err) => {
        console.error("❌ login/magic 실패:", err);
        setStatus("error");
        setMsg("로그인 처리 실패");
      });
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
