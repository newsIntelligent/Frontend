import { useEffect, useState } from "react";
import EmailInput from "../components/LoginPage/EmailInput";
import LoginLog from "../components/LoginPage/LoginLog";
import CodeInput from "../components/LoginPage/CodeInput";
import LeftSection from "../components/LoginPage/LeftSection";
import LoginComplete from "../components/LoginPage/LoginComplete";

const LoginPage = () => {
  const [step, setStep] = useState<"email" | "verify" | "complete">("email");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fromLoginLog, setFromLoginLog] = useState(false);
  const [hasLoginHistory, setHasLoginHistory] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false); // 자동로그인 관리
  
  // 인증 코드 재전송 관련
  const [resendCount, setResendCount] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const MAX_RESEND = 3;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setHasLoginHistory(!!token); // 로그인 이력 존재 여부 판단
  }, []);

  // 새 코드 요청
  const handleResendCode = async () => {
    if (resendCount >= MAX_RESEND) return;

    setIsResending(true);
  
    try{
      const response = await fetch("", {
        method: "POST",
        body: JSON.stringify({email}),
        headers:{"Content-Type": "application/json"},
      });

      if (!response.ok){
        throw new Error("인증 코드 재요청 실패");
      }
  
      setResendCount((prev) => prev + 1);
      }
    catch(error){
      console.error(error);
    }
  };

  const renderRightSection = () => {
    switch (step) {
      case "email":
        return (
          <div className="flex flex-col gap-2">
            <EmailInput
              autoLogin={autoLogin}
              onToggleAutoLogin={()=>setAutoLogin(prev => !prev)}
              onNext={(inputEmail) => {
                setEmail(inputEmail);
                setFromLoginLog(false);
                setStep("verify");
              }}
            />
            {hasLoginHistory && (
              <LoginLog
                onSelect={(selectedEmail, name) => {
                  setEmail(selectedEmail);
                  setUserName(name);
                  setFromLoginLog(true);
                  setStep("verify");
                }}
              />
            )}
          </div>
        );

      case "verify":
        return <CodeInput 
                  onComplete={()=> setStep("complete")}
                  autoLogin={autoLogin}
                  setAutoLogin={setAutoLogin}
                  isResending={isResending}
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
