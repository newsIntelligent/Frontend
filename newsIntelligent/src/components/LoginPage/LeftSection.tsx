import { useNavigate } from "react-router-dom";

interface LeftSectionProps {
  step: string;
  userName?: string;
  email?: string;
  fromLoginLog?: boolean;
  onResendCode?: () => void;
  resendCount?: number;
  maxResend?: number;
}

const LeftSection = ({ step, userName, email, fromLoginLog = false, onResendCode, resendCount, maxResend }: LeftSectionProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const renderHeader = () => {
    if (step === "verify") {
        if (fromLoginLog) {
        return <p className="text-2xl font-semibold text-[#0EA6C0]">안녕하세요, {userName}님</p>;
        } else {
        return <img src="Logo.svg" alt="로고" className="w-[384px] h-[73px] mb-4" />;
        }
    } else if (step === "complete" && !fromLoginLog) {
        return <p className="text-2xl font-semibold text-[#0EA6C0]">회원가입 완료</p>;
    } else {
        return <img src="Logo.svg" alt="로고" className="w-[384px] h-[73px] mb-4" />;
    }
  };


  const renderMessage = () => {
    if (step === "verify") {
      return (
        <p className="text-sm text-[#666] leading-relaxed">
          이메일로 코드를 보내드렸습니다.<br />
          <span className="font-medium">{email}</span>(으)로 이메일을 보냈습니다.<br />
          여기에 코드를 입력하거나, 이메일에 있는 버튼을 탭하여 계속하세요.<br />
          이메일이 보이지 않으면 스팸 또는 정크 폴더를 확인하세요.<br /><br />
          <span className={`text-[#0EA6C0] cursor-pointer underline ${resendCount! >= maxResend! && "opacity-40 cursor-not-allowed"}`}
                onClick={resendCount! < maxResend! ? onResendCode:undefined}>
            새 코드를 요청하세요.
          </span>
        </p>
      );
    } else if (step === "email") {
      return (
        <p className="text-sm font-semibold text-[#666] leading-relaxed">
          회원가입 시<br />
          <span className="text-[#06525F]">구독한 주제, 키워드 알림, 원문 트래픽 변경점</span>을<br />
          이메일로 알림 받으실 수 있습니다.
        </p>
      );
    } else {
      return null;
    }
  };

  const renderBackButton = () => {
    if (step === "email") return null;
    const label = fromLoginLog
      ? "다른 이메일로 로그인하기"
      : "다른 메일로 가입한 이력이 있으신가요? (돌아가기)";
    return (
      <button onClick={handleBack} className="text-sm text-[#666] underline mt-8">
        ← {label}
      </button>
    );
  };

  return (
    <div className="w-1/2 pl-8 pt-8">
      {renderHeader()}
      <div className="mt-4">{renderMessage()}</div>
      {renderBackButton()}
    </div>
  );
};

export default LeftSection;
