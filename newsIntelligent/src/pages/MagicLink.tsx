import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuth } from "../apis/auth";

export default function MagicLink() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ 해시에서 accessToken, refreshToken 등 추출
  const getTokensFromHash = () => {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    return {
      accessToken: params.get("accessToken") || "",
      refreshToken: params.get("refreshToken") || "",
      expiresInSec: Number(params.get("expiresInSec") || 7 * 86400),
      email: params.get("email") || "",
      name: params.get("name") || "",
      profileImageUrl: params.get("profileImageUrl") || "",
    };
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const { accessToken, refreshToken, expiresInSec, email, name, profileImageUrl } =
      getTokensFromHash();

    console.log("🔑 해시 파싱 accessToken:", accessToken);

    if (!accessToken) {
      setStatus("error");
      setMsg("토큰이 없습니다.");
      return;
    }

    try {
      // ✅ accessToken 저장
      persistAuth(
        {
          accessToken,
          refreshToken,
          expiresInSec,
          user: { email, name, profileImageUrl },
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
