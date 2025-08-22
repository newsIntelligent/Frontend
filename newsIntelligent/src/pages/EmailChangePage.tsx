import { useState, useCallback } from "react";
import LeftSection from "../components/LoginPage/LeftSection";
import { resendEmailChangeCode, sendEmailChangeCode, verifyEmailChangeCode } from "../apis/auth";
import EmailInput from "../components/LoginPage/EmailInput";
import CodeInput from "../components/LoginPage/CodeInput";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api/axios";

// 응답 바디/헤더 어디에 담겨와도 토큰을 뽑아내는 안전 헬퍼
function pickAccessToken(resp: unknown): string | null {
  if (!resp || typeof resp !== "object") return null;
  const r = resp as Record<string, any>;

  console.log("pickAccessToken 입력:", r);

  // 1) axios response 객체 형태일 때
  const data = r.data ?? r;
  console.log("응답 데이터:", data);
  
  const bodyToken =
    data?.result?.accessToken ??
    data?.accessToken ??
    data?.token ??
    r?.result?.accessToken ??
    r?.accessToken ??
    r?.token;
    
  if (typeof bodyToken === "string" && bodyToken) {
    console.log("바디에서 토큰 추출:", bodyToken);
    return bodyToken;
  }

  // 2) 헤더에 Bearer 토큰이 실려오는 경우
  const headers = r.headers as Record<string, any> | undefined;
  const authHeader = headers?.authorization ?? headers?.Authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    console.log("헤더에서 토큰 추출:", token);
    return token;
  }
  
  console.log("토큰을 찾을 수 없음");
  return null;
}

const EmailChangePage = () => {
    const [step, setStep] = useState<"email" | "verify">("email");
    const [email, setEmail] = useState("");
    const [resendCount, setResendCount] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const MAX_RESEND = 3;
    const navigate = useNavigate();

    // verifyFn을 useCallback으로 메모이제이션
    const handleVerifyCode = useCallback(async (email: string, code: string) => {
        try {
            // 1) 검증 호출(교환/재발급은 서버 정책에 따름)
            const resp: unknown = await verifyEmailChangeCode(email, code);

            console.log("이메일 변경 검증 응답:", resp);

            // 2) 새 토큰이 오면 갈아끼우고, 없으면 기존 저장 토큰을 재장착
            const newToken = pickAccessToken(resp);
            console.log("추출된 새 토큰:", newToken);

            if (newToken) {
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                localStorage.setItem("accessToken", newToken);
                console.log("토큰 업데이트 완료");
            } else {
                console.log("새 토큰이 없어서 기존 토큰 유지");
                // 기존 토큰이 유효한지 확인
                const currentToken = localStorage.getItem("accessToken");
                if (currentToken) {
                    axiosInstance.defaults.headers.common.Authorization = `Bearer ${currentToken}`;
                }
            }

            return true; // → onComplete()가 /notification으로 이동
        } catch (e) {
            console.error("이메일 변경 코드 검증 실패", e);
            return false;
        }
    }, []);

    const handleResendCode = async () => {
        if (resendCount >= MAX_RESEND) return;
        setIsResending(true);
        try{
            await resendEmailChangeCode(email);
            setResendCount((prev)=>prev+1);
        }
        catch(error){
            console.error(error);
        }
        finally{
            setIsResending(false);
        }
    };

    const renderRightSection = () => {
        if (step === "email") {
            return(
                <EmailInput
                    autoLogin={false}
                    onToggleAutoLogin={()=>{}}
                    showAutoLogin={false}
                    submitLabel="알림 받을 이메일 변경하기"
                    isProcessing={isProcessing}
                    onNext={async (inputEmail)=>{
                        try{
                            setError(null);
                            setIsProcessing(true);
                            
                            const canonical = inputEmail.trim().toLowerCase();
                            setEmail(canonical);
                            
                            // 토큰이 없으면 에러 처리
                            const saved = localStorage.getItem("accessToken");
                            if (!saved) {
                                setError("로그인이 필요합니다. 다시 로그인해주세요.");
                                return;
                            }
                            
                            await sendEmailChangeCode(canonical);
                            setStep("verify");
                        } catch (e) {
                            console.error("이메일 변경 코드 전송 실패", e);
                            
                            // 에러 타입에 따른 메시지 분기
                            if (e && typeof e === 'object' && 'response' in e) {
                                const status = (e as any).response?.status;
                                if (status === 400) {
                                    setError("이미 등록된 이메일이거나 잘못된 이메일 형식입니다.");
                                } else if (status === 401) {
                                    setError("로그인이 필요합니다. 다시 로그인해주세요.");
                                } else {
                                    setError("이메일 변경 코드 전송에 실패했습니다. 다시 시도해주세요.");
                                }
                            } else {
                                setError("이메일 변경 코드 전송에 실패했습니다. 다시 시도해주세요.");
                            }
                        } finally {
                            setIsProcessing(false);
                        }
                    }}
                />
            );
    }
        if (step === "verify") {
            return (
                <CodeInput
                    email={email}
                    onComplete={() => navigate("/notification", {replace:true})}
                    autoLogin={false}
                    setAutoLogin={()=>{}}
                    isResending={isResending}
                    fromLoginLog={false}
                    setFromLoginLog={()=>{}}
                    verifyFn={handleVerifyCode}
                />
            );
        }
        return null;
    }

    return (
        <div className="w-screen h-screen bg-[#DEF0F0] flex items-center justify-center">
            <div className="w-[1160px] h-[640px] bg-white rounded-[16px] shadow-md px-12 py-10 flex">
                <LeftSection
                    step={step}
                    email={email}
                    fromLoginLog={false}
                    onResendCode={handleResendCode}
                    resendCount={resendCount}
                    maxResend={MAX_RESEND}
                    customTitle="알림 이메일 변경"
                    customMessage={
                        <p className="text-sm text-[#666] leading-relaxed font-semibold">
                            알림 이메일 변경 시<br/>
                            <span className="text-[#06525F]">구독한 주제, 키워드 알림, 읽은 토픽의 변경점</span>을<br/>
                            변경한 이메일로 받으실 수 있습니다.<br /><br />
                            회원가입한 이메일은 변경되지 않습니다.
                        </p>
                    }
                    backLabel="이전 페이지로 돌아가기"
                    onBackLabelClick={()=>navigate(-1)}
                />
                <div className="w-1/2 flex items-center justify-center">
                    {renderRightSection()}
                    {error && (
                        <div className="absolute bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmailChangePage;