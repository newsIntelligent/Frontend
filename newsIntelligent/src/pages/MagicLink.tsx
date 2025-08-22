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
        const token = hashToken || queryToken;

        if (token) {
          console.log("🔑 매직링크 accessToken:", token);

          // 1️⃣ 토큰 저장
          persistAuthRelaxed(
            {
              accessToken: token,
              refreshToken: "",
              expiresInSec: 7 * 86400,
              user: {}, // 임시
            },
            7
          );

          // 2️⃣ 서버에서 userInfo 가져오기
          try {
            const res = await axiosInstance.get("/members/info");
            localStorage.setItem("userInfo", JSON.stringify(res.data.result));
          } catch (err) {
            console.error("유저 정보 불러오기 실패:", err);
          }

          setStatus("done");
          setTimeout(() => navigate("/", { replace: true }), 800);
          return;
        }

        setStatus("error");
        setMsg("토큰이 없습니다.");
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
