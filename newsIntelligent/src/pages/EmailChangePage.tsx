import { useState } from "react";
import LeftSection from "../components/LoginPage/LeftSection";
import { resendEmailChangeCode, sendEmailChangeCode, verifyEmailChangeCode } from "../apis/auth";
import EmailInput from "../components/LoginPage/EmailInput";
import CodeInput from "../components/LoginPage/CodeInput";
import { useNavigate } from "react-router-dom";

const EmailChangePage = () => {
    const [step, setStep] = useState<"email" | "verify" | "complete">("email");
    const [email, setEmail] = useState("");
    const [resendCount, setResendCount] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const MAX_RESEND = 3;
    const navigate = useNavigate();

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
                    onNext={async (inputEmail)=>{
                        setEmail(inputEmail);
                        await sendEmailChangeCode(inputEmail);
                        setStep("verify");
                    }}
                />
            );
    }
        if (step === "verify") {
            return (
                <CodeInput
                    email={email}
                    onComplete={() => setStep("complete")}
                    autoLogin={false}
                    setAutoLogin={()=>{}}
                    isResending={isResending}
                    fromLoginLog={false}
                    verifyFn={async (email, code)=>{
                        try{
                            await verifyEmailChangeCode(email, code);
                            return true;
                        }
                        catch{
                            return false; // 인증 실패 시 false 반환
                        }
                    }}
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
                </div>
            </div>
        </div>
    )
}

export default EmailChangePage;