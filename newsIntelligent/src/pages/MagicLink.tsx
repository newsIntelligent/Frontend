import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

export default function MagicLink() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const once = useRef(false);

  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [msg, setMsg] = useState("로그인 확인 중…");

  // ✅ 해시에서 token 추출 (#token=abcd1234)
  const getAccessTokenFromHash = (): string => {
    const hashParams = new URLSearchParams(hash.replace(/^#/, "?"));
    return hashParams.get("token") || "";
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    const accessToken = getAccessTokenFromHash();
    console.log("🔑 해시 파싱 accessToken:", accessToken);

    if (!accessToken) {
      setStatus("error");
      setMsg("토큰이 없습니다.");
      return;
    }

    // ✅ 로컬스토리지 저장
    localStorage.setItem("accessToken", accessToken);

    // ✅ axios 헤더에 적용
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;

    setStatus("done");
    setMsg("로그인 성공!");
    navigate("/"); // 메인페이지나 마이페이지 등으로 이동
  }, [hash, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === "loading" && <p>{msg}</p>}
      {status === "error" && (
        <div>
          <p className="text-red-500">링크 오류</p>
          <p>{msg}</p>
          <button onClick={() => navigate("/login")}>로그인 페이지로</button>
        </div>
      )}
    </div>
  );
}
