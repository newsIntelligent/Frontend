import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { persistAuth } from "../apis/auth";

export default function MagicLink() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ 해시에서 token 추출 (#token=abcd1234)
  const getAccessTokenFromHash = () => {
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    return params.get("token") || "";
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    try {
      const accessToken = getAccessTokenFromHash();

      if (!accessToken) {
        setStatus("error");
        setMsg("토큰이 없습니다.");
        return;
      }

      console.log("🔑 해시 기반 accessToken:", accessToken);

      // ✅ 기존 로그인 로직처럼 persistAuth 호출
      persistAuth(
        {
          accessToken,
          refreshToken: "", // 매직링크에선 안 오니까 빈 값
          expiresInSec: 7 * 86400, // 기본 7일
          user: { email: "", name: "" }, // 서버에서 정보 가져오는 로직 있으면 추가 가능
        },
        7
      );

      setStatus("done");
      setTimeout(() => navigate("/", { replace: true }), 800);
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
