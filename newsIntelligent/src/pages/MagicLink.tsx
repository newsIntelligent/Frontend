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

  // ✅ 해시에서 accessToken 추출
  const getFromHash = () => {
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

  // ✅ 쿼리에서 token 추출
  const getQueryToken = () => {
    const params = new URLSearchParams(search);
    return params.get("token") || "";
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const tryLogin = async () => {
      try {
        // 1️⃣ 해시 먼저 확인
        const { accessToken, refreshToken, expiresInSec, email, name, profileImageUrl } = getFromHash();

        if (accessToken) {
          console.log("🔑 해시 기반 accessToken:", accessToken);
          persistAuth(
            { accessToken, refreshToken, expiresInSec, user: { email, name, profileImageUrl } },
            7
          );
          setStatus("done");
          setTimeout(() => navigate("/", { replace: true }), 800);
          return;
        }

        // 2️⃣ 해시에 없으면 → 쿼리 토큰으로 API 호출
        const queryToken = getQueryToken();
        if (!queryToken) {
          setStatus("error");
          setMsg("토큰이 없습니다.");
          return;
        }

        console.log("🔎 쿼리 기반 token:", queryToken);

        const { data } = await axiosInstance.get("/members/login/magic", {
          params: { token: queryToken },
        });

        console.log("✅ 매직링크 응답:", data);

        const result = data.result;
        if (!result?.accessToken) throw new Error("유효하지 않은 응답");

        persistAuth(
          {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            expiresInSec: result.expiresInSec ?? 7 * 86400,
            user: result.user ?? { email: "", name: "" },
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
