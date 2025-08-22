import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuth } from "../apis/auth";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { search, hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ URL에서 token 추출 (쿼리 + 해시 모두 지원)
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

    const doLogin = async () => {
      try {
        // ✅ 1) 매직링크 검증 API 호출
        const { data } = await axiosInstance.get(`/members/login/magic`, {
          params: { token },
        });

        console.log("✅ 매직링크 응답:", data);

        // ✅ 2) 응답을 persistAuth에 저장
        persistAuth(
          {
            accessToken: data.result.accessToken,
            refreshToken: data.result.refreshToken,
            expiresInSec: data.result.expiresInSec,
            user: data.result.user,
          },
          7
        );

        setStatus("done");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 800);
      } catch (err) {
        console.error("로그인 처리 실패:", err);
        setStatus("error");
        setMsg("로그인 처리 실패");
      }
    };

    doLogin();
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
