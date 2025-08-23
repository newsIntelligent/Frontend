import { useEffect, useState } from "react";

export default function MagicLink() {
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const token = params.get("token");
      const exp = params.get("exp");

      if (token) {
        // ✅ 토큰 저장
        localStorage.setItem("accessToken", token);
        if (exp) {
          localStorage.setItem("accessTokenExp", exp);
        }

        setStatus("done");

        // ✅ 안전한 페이지로 이동
        setTimeout(() => {
          window.location.replace("/");
        }, 800);
      } else {
        setStatus("error");
        setMsg("토큰이 없습니다.");
      }
    } catch (err) {
      console.error("로그인 처리 실패:", err);
      setStatus("error");
      setMsg("로그인 처리 실패");
    }
  }, []);

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
