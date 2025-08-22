import React, { useRef, useEffect, useState } from "react";
import Loading from "./Loading";
import { persistAuth, verifyLoginCode, verifySignupCode, type AuthResult } from '../../apis/auth';
import { axiosInstance } from "../../api/axios";

interface CodeInputProps {
  onComplete: () => void;
  autoLogin: boolean;
  setAutoLogin:(value: boolean)=>void;
  isResending?: boolean;
  email: string;
  fromLoginLog: boolean;
  verifyFn?: (email: string, code: string) => Promise<boolean>;
  setFromLoginLog?: (v: boolean)=> void;
}

const CodeInput = ({ onComplete, autoLogin, setAutoLogin, isResending, email, fromLoginLog, verifyFn}: CodeInputProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // 중복 검증 요청 방지 가드 (일회용 코드 특성 반영)
  const verifyInFlightRef = useRef(false);

  // input 배열형 ref 설정 함수
  const setRef = (index: number) => (el: HTMLInputElement | null) => {
    if (el) inputRefs.current[index] = el;
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 에러 상태 초기화 & 입력 리셋
  useEffect(() => {
    if (isResending){
      setError(false);
      setIsLoading(false);
      setCode("");
      inputRefs.current[0]?.focus();
      verifyInFlightRef.current = false; // 재전송 시 중복 요청 방지 플래그 초기화
    }    
  }, [isResending]);

  // 인증번호 6자리 완료 시 로직
  useEffect(() => {
    const isComplete = code.length === 6 && code.split("").every((c) => c);
    if (!isComplete || isLoading || isResending) return;
    if (verifyInFlightRef.current) return; // 중복 호출 방지

    (async () => {
      try {
        verifyInFlightRef.current = true;
        setIsLoading(true);
        setError(false);

        const fullCode = code.replace(/\D/g, "").slice(0, 6);
        const fullEmail = email.trim().toLowerCase();

        // verifyFn이 주어지면(이메일 변경) 그것만 사용하고 종료
        if (verifyFn) {
          const ok = await verifyFn(fullEmail, fullCode);
          if (!ok) throw new Error("유효하지 않은 코드");
          setIsLoading(false);
          verifyInFlightRef.current = false;
          onComplete();
          return;
        }

        // 검증 API 호출 (로그인/회원가입 동일 처리)
        const resp = fromLoginLog
          ? await verifyLoginCode(fullEmail, fullCode)
          : await verifySignupCode(fullEmail, fullCode);

        // 응답 성공 여부 먼저
        if (!resp?.isSuccess) {
          throw new Error("유효하지 않은 코드");
        }

        // 토큰 추출 (회원가입도 로그인과 동일하게 토큰 발급)
        const result = resp.result as AuthResult | undefined;
        const accessTokenMaybe = result?.accessToken;
        if (!accessTokenMaybe) throw new Error("토큰이 없습니다");

        // 결과 구조 분해
        const {
          accessToken,
          refreshToken,
          expiresInSec,
          user: { email: respEmail, name, profileImageUrl },
        } = result!;

        // 토큰 관리
        // 헤더는 무조건 즉시 세팅 → 다음 페이지에서도 인증 유지
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // 토큰 저장 - 자동로그인 체크 여부와 관계없이 7일 유지
        const rememberDays = 7;
        persistAuth(
          {
            accessToken,
            refreshToken,
            expiresInSec: expiresInSec ?? rememberDays * 24 * 60 * 60,
            user: {
              email: respEmail || fullEmail,
              name: name || (respEmail || fullEmail).split("@")[0],
              profileImageUrl,
            },
          },
          rememberDays
        );

        setIsLoading(false);
        setCode(""); // 입력창 리셋 (재전송 방지)
        verifyInFlightRef.current = false;
        onComplete(); // 성공 시 다음 단계로 이동
      } catch (e) {
        console.error(e);
        setIsLoading(false);
        setError(true);
        setCode("");
        inputRefs.current[0]?.focus();
        verifyInFlightRef.current = false;
      }
    })();
  }, [code, isLoading, isResending, email]); // 의존성 배열 최소화
      
  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, "");
    if (!digit) return;

    const codeArray = code.padEnd(6,"").split("");
    codeArray[index] = digit[0];
    const newCode = codeArray.join("");
    setCode(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const { key } = e;

    if (key === "Backspace") {
      const arr = code.padEnd(6, "").split("");
      if (arr[index]) {
        arr[index] = "";
        setCode(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        setCode(arr.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").replace(/[^0-9]/g, "").slice(0, 6);

    if (pasted.length === 6) {
      setCode(pasted);
    }
  };
 
  return (
    <div className="flex flex-col gap-4 w-full max-w-[499px]">
      {/* 코드 입력 */}
      <div onPaste={handlePaste}>
        {[...Array(6)].map((_, i) => {
          let rounded = "";
          if (i === 0) rounded = "rounded-l-md";
          else if (i === 2) rounded = "rounded-r-md";
          else if (i === 3) rounded = "rounded-l-md";
          else if (i === 5) rounded = "rounded-r-md";
          
          return (
            <React.Fragment key={i}>
              <input
                ref={setRef(i)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                disabled={isLoading}
                value={code[i] || ""}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`w-[60px] h-[80px] border border-gray-400 text-center text-xl 
                  focus:outline-none focus:ring-2 focus:ring-[#0EA6C0] ${rounded} 
                  ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {i === 2 && <span className="text-2xl"> - </span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* 자동 로그인 상태 표시 */}
      <label className="inline-flex items-center gap-2 mb-4 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={autoLogin}
          onChange={()=>setAutoLogin(!autoLogin)}
          className="w-4 h-4 rounded-[4px] border border-gray-400
            appearance-none checked:bg-[#0EA6C0] checked:border-[#0EA6C0]
            transition cursor-pointer"
        />
        자동 로그인
      </label>

      {/* 로딩 또는 오류 메시지 */}
      {(isLoading || isResending) && (
        <Loading error={false} message={isResending?"코드 전송 중...": "코드 확인 중..."} />)}
      {!isLoading && error && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <img src="Error.svg" alt="오류아이콘" className="w-[36px] h-[36px]" />
          <p className="text-[#FF3333] font-semibold text-sm">
            입력한 코드가 유효하지 않습니다. 다시 시도해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
