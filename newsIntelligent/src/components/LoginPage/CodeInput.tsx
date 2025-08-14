import React, { useRef, useEffect, useState } from "react";
import Loading from "./Loading";
import { verifyLoginCode, verifySignupCode } from "../../apis/auth";

interface CodeInputProps {
  onComplete: () => void;
  autoLogin: boolean;
  setAutoLogin:(value: boolean) =>void;
  isResending?: boolean;
  email: string;
  fromLoginLog: boolean;
  verifyFn?: (email: string, code: string) => Promise<boolean>;
}

type VerifyResponse = {isSuccess: boolean};

const CodeInput = ({ onComplete, autoLogin, setAutoLogin, isResending, email, fromLoginLog, verifyFn }: CodeInputProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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
    }    
  }, [isResending]);

  // 인증번호 6자리 완료 시 로직
  useEffect(() => {
    const isComplete = code.length === 6 && code.split("").every((char) => char !== "");
    if (isComplete && !isLoading && !error && !isResending) {
      setIsLoading(true);
      setError(false);

      const fullCode = code.replace(/\D/g,"").slice(0,6);
      const fullEmail = email.trim().toLowerCase();

      (async ()=> {
        try{
          { /* 인증번호 입력 완료 시 */ }
          const isValid = verifyFn
            ? await verifyFn(fullEmail, fullCode)
            : (fromLoginLog
              ? await verifyLoginCode(fullEmail, fullCode)
              : await verifySignupCode(fullEmail, fullCode));
            
          const ok =
            isValid === true ||
            (typeof isValid === "object" && (isValid as VerifyResponse)?.isSuccess === true);

          console.log("🔎 verify payload", { email: fullEmail, code: fullCode }, "→ ok:", ok);


          if (ok) {
            setIsLoading(false);
            onComplete(); // 인증 성공
          }
          else {
            setCode("");
            inputRefs.current[0]?.focus();
            throw new Error("유효하지 않은 코드")
          }
        }
        catch (err){
          console.error("인증 실패", err);
          setError(true);
          setIsLoading(false);
          setCode("");
          inputRefs.current[0]?.focus(); // 다시 첫번째 칸으로 포커스 이동
        }
      })();
    }
  },[code, isLoading, error, isResending, fromLoginLog, email, onComplete, verifyFn]);
      
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
    <div className="flex flex-col gap-4 w-[499px]">
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
      {(isLoading || isResending) && <Loading error={false} />}
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
