import { useEffect, useState } from "react";
import EmailInput from "../components/LoginPage/EmailInput";
import LoginLog from "../components/LoginPage/LoginLog";
import CodeInput from "../components/LoginPage/CodeInput";
import LeftSection from "../components/LoginPage/LeftSection";
import LoginComplete from "../components/LoginPage/LoginComplete";
import { sendLoginCode, resendMagicLink } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const LoginPage = () => {
  const [step, setStep] = useState<"email" | "verify" | "complete">("email");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fromLoginLog, setFromLoginLog] = useState(false);
  const [hasLoginHistory, setHasLoginHistory] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false); // 자동로그인 관리
  const navigate = useNavigate();
  
  // 인증 코드 재전송 관련
  const [resendCount, setResendCount] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const MAX_RESEND = 3;

  useEffect(() => {
    // 만료 토큰 정리(토큰만 제거, userInfo는 유지)
    //enforceAuthExpiry();

    const token = localStorage.getItem("accessToken");
    const userInfo = localStorage.getItem("userInfo");

    try{
      const parsed = JSON.parse(userInfo || "{}");
      if (token && parsed.email && parsed.name){
        // 토큰 + userInfo가 있으면 최근 로그인 기록 있음
        setHasLoginHistory(true);
      } else if (parsed.email && parsed.name){
        // 토큰은 없어도 userInfo만 있으면 LoginLog 노출은 가능
        setHasLoginHistory(true);
      } else{
        setHasLoginHistory(false);
      }
    }
    catch(error){
      console.error(error);
      setHasLoginHistory(false);
    }
  }, []);

  // 새 코드 요청
  const handleResendCode = async () => {
    if (!email || isResending || resendCount >= MAX_RESEND) return;

    setIsResending(true);
  
    try{
      // email은 이미 canonical 상태(state)라 그대로 사용
      await resendMagicLink(email, fromLoginLog);
      setResendCount((prev)=> prev+1);
    }
    catch (error){
      console.error("인증 코드 요청 실패", error);
    }
    finally {
      setIsResending(false);
    }
  };

  // “로그인 먼저 → 필요 시 회원가입 폴백” 판단
  const needSignupFallback = (e: unknown) => {
    if (!isAxiosError(e)) return false;
    const status = e.response?.status;
    const data = e.response?.data as { code?: string; message?: string } | undefined;
    const code = data?.code?.toString().toUpperCase();
    const msg  = (data?.message || "").toString();

    // 서버 코드/메시지 케이스 보강
    const codeHit = !!code && [
      "NEED_SIGNUP",
      "MEMBER_NOT_FOUND",
      "MEMBERA04",
      "MEMBERA404",
      "USER_NOT_FOUND",
    ].includes(code);

    const msgHit = [
      /존재하지 않는 회원/i,
      /가입되지 않은/i,
      /회원이 아닙니다/i,
      /not\s*found/i,
      /not\s*exist/i,
      /not\s*registered/i,
    ].some((re) => re.test(msg));

    // 400/404 류에서 코드나 메시지가 맞으면 폴백
    return (status === 400 || status === 404) && (codeHit || msgHit);
  };

  const renderRightSection = () => {
    switch (step) {
      case "email":
        return (
          <div className="flex flex-col gap-2">
            <EmailInput
              autoLogin={autoLogin}
              onToggleAutoLogin={()=>setAutoLogin(prev => !prev)}
              onNext={async (inputEmail) => {
                console.log("입력된 이메일 : ", inputEmail)

                // ✅ 발급 단계에서도 canonical 처리
                const canonical = inputEmail.trim().toLowerCase();
                setEmail(canonical);

                // 로그인 코드 전송 먼저 시도 → “가입 필요”면 회원가입 코드로 폴백
                try {
                  await sendLoginCode(canonical, /* isLogin */ true);
                  setFromLoginLog(true);   // 검증에서도 로그인 플로우로 진행
                } catch (e: unknown) {
                  if (needSignupFallback(e)) {
                    await sendLoginCode(canonical, /* isLogin */ false);
                    setFromLoginLog(false); // 검증에서는 회원가입 플로우로 진행
                  } else {
                    throw e;
                  }
                }

                setStep("verify");
              }}
            />
            {hasLoginHistory && (
              <LoginLog
                onSelect={async (selectedEmail, name) => {
                  // ✅ LoginLog 선택 시에도 canonical 처리
                  const canonical = selectedEmail.trim().toLowerCase();
                  setEmail(canonical);
                  setUserName(name);

                  // 과거 기록 클릭 시에도 로그인 우선 → 실패 시 가입 코드로 폴백
                  try {
                    await sendLoginCode(canonical, /* isLogin */ true);
                    setFromLoginLog(true);
                  } catch (e: unknown) {
                    if (needSignupFallback(e)) {
                      await sendLoginCode(canonical, /* isLogin */ false);
                      setFromLoginLog(false);
                    } else {
                      throw e;
                    }
                  }

                  setStep("verify");
                }}
              />
            )}
          </div>
        );

      case "verify":
        return <CodeInput 
                  onComplete={()=> navigate("/settings")}
                  autoLogin={autoLogin}
                  setAutoLogin={setAutoLogin}
                  isResending={isResending}
                  email={email}              // 이미 canonical 상태
                  fromLoginLog={fromLoginLog}
                />;

      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#DEF0F0] flex items-center justify-center overflow-hidden relative">
      {/* 로그인 카드 영역 */}
      {step !== "complete" && (
        <div className="w-[1440px] h-[1024px] bg-[#DEF0F0] flex items-center justify-center">
          <div className="w-[1160px] h-[640px] bg-white rounded-[16px] shadow-md px-12 py-10 flex">
            <LeftSection
              step={step}
              userName={userName}
              email={email}
              fromLoginLog={fromLoginLog}
              onResendCode={handleResendCode}
              resendCount={resendCount}
              maxResend={MAX_RESEND}
              onBackLabelClick={()=>setStep("email")}
            />
            <div className="w-1/2 flex items-center justify-center">
              {renderRightSection()}
            </div>
          </div>
        </div>
      )}

      {/* 화면 전체 덮는 LoginComplete */}
      {step === "complete" && (
        <div className="absolute inset-0 z-50 bg-white">
          <LoginComplete />
        </div>
      )}
    </div>
  );
};

export default LoginPage;
