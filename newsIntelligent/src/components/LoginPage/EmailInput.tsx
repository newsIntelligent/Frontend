import { useState, useRef, useEffect } from "react";

interface EmailInputProps {
  onNext: (email: string) => void;
  autoLogin: boolean;
  onToggleAutoLogin:()=> void;
  submitLabel?: string;
  showAutoLogin?: boolean;
}

const EmailInput = ({ onNext, autoLogin, onToggleAutoLogin, submitLabel = "이메일로 간편 로그인/회원가입", showAutoLogin = true }: EmailInputProps) => {
  const [localEmail, setLocalEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [customInput, setCustomInput] = useState(true); // 직접입력을 기본값으로 설정
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const domainRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const suppressChangeRef = useRef(false); // 입력값 변경 억제 플래그
  const inFlightRef = useRef(false); // 중복 요청 방지 플래그

  // 물리키 -> 알파벳 매핑
  const physicalMap: Record<string, string> = {
    Digit0:'0',Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Digit5:'5',Digit6:'6',Digit7:'7',Digit8:'8',Digit9:'9',
    KeyQ:'q',KeyW:'w',KeyE:'e',KeyR:'r',KeyT:'t',KeyY:'y',KeyU:'u',KeyI:'i',KeyO:'o',KeyP:'p',
    KeyA:'a',KeyS:'s',KeyD:'d',KeyF:'f',KeyG:'g',KeyH:'h',KeyJ:'j',KeyK:'k',KeyL:'l',
    KeyZ:'z',KeyX:'x',KeyC:'c',KeyV:'v',KeyB:'b',KeyN:'n',KeyM:'m',
  };

  // 붙여넣기에서 영문/숫자만 남기는 정규화
  const handleLocalPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text") || "";
    const normalized = text.replace(/[^a-zA-Z0-9]/g, "");

    const input = localInputRef.current;
    if (!input) {
      setLocalEmail(prev => prev + normalized);
      return;
    }

    const start = input.selectionStart ?? localEmail.length;
    const end   = input.selectionEnd   ?? localEmail.length;

    suppressChangeRef.current = true; // 입력값 변경 억제 플래그 활성화

    input.setRangeText(normalized, start, end, "end");
    setLocalEmail(input.value);
  };

  // 물리키 기반 입력
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // 엔터 키 처리
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isFormValid() && !isSubmitting) handleSubmit();
      return;
    }

    if (
      e.key === "Enter" || e.key === "Tab" ||
      e.key === "ArrowLeft" || e.key === "ArrowRight" ||
      e.key === "ArrowUp" || e.key === "ArrowDown" ||
      e.key === "Home" || e.key === "End" ||
      e.key === "PageUp" || e.key === "PageDown" ||
      e.key === "Backspace" || e.key === "Delete"
    ) {
      return; // 삭제/이동 등은 기본 동작 허용
    }

    if (e.key === " ") { e.preventDefault(); return; }

    const chBase = physicalMap[e.code];
    if (!chBase) return;

    const ch = e.shiftKey ? chBase.toUpperCase() : chBase; // Shift → 대문자
    e.preventDefault();

    const input = localInputRef.current;
    if (!input) {                  // 혹시 ref가 아직 없으면 안전하게 맨 뒤에 추가
      setLocalEmail(prev => prev + ch);
      return;
    }

    const start = input.selectionStart ?? localEmail.length;
    const end   = input.selectionEnd   ?? localEmail.length;

    suppressChangeRef.current = true; // 입력값 변경 억제 플래그 활성화

    // 브라우저에 현재 selection 구간 대체를 맡김 + 커서를 삽입 끝으로
    input.setRangeText(ch, start, end, "end");
    setLocalEmail(input.value);     // controlled input과 값 동기화
  };

  const domainOptions = [
    "직접입력",
    "naver.com",
    "gmail.com",
    "daum.net",
    "hanmail.net",
    "nate.com",
  ];

  const handleSubmit = () => {
    if (!isFormValid() || isSubmitting || inFlightRef.current) return;
    inFlightRef.current = true; // 중복 요청 방지 플래그 활성화

    setIsSubmitting(true);
    const pickedDomain = customInput ? domain.trim() : domain;
    const fullEmail = `${localEmail}@${pickedDomain}`;
    Promise.resolve(onNext(fullEmail))
            .finally(()=>{
              inFlightRef.current=false;
              setIsSubmitting(false)});
  };

  const handleLocalEmailChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const isComposing = (e.nativeEvent as any)?.isComposing === true;
    if (isComposing) return;

    if (suppressChangeRef.current) {
      suppressChangeRef.current = false;
      return;
  }

    const value = e.target.value;
    const filtered = value.replace(/[^a-zA-Z0-9]/g,"");  //영어, 숫자로 제한
    setLocalEmail(filtered);
  };

  const isFormValid = () => {
    if (!localEmail) return false;
    if (customInput) return domain.trim() !=="";
    return domain !== "";
  };

  const handleOptionClick = (option: string) => {
    if (option === "직접입력") {
      setCustomInput(true);
      setDomain("");
      setTimeout(()=> {
        const input = domainRef.current?.querySelector("input");
        (input as HTMLInputElement | null)?.focus();
      }, 0);
    }
    else {
      setCustomInput(false);
      setDomain(option);
    }
    setShowDropdown(false);
  };

  // 입력창 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        domainRef.current &&
        !domainRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-[500px]">
      {/* 입력폼 */}
      <div className="flex flex-col sm:flex-row sm:mt-4 gap-2 mb-3">
        {/* 로컬 파트 입력 */}
        <div className="relative w-full sm:w-[240px]">
          <input
            type="text"
            placeholder="이메일 입력"
            value={localEmail}
            ref={localInputRef}
            onKeyDown={handleKeyDown}
            onPaste={handleLocalPaste}
            onChange={handleLocalEmailChange}
            className="w-full h-[49px] border border-gray-300 px-3 py-2 text-sm pr-8"
            tabIndex={1}
          />
          {localEmail && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              onClick={() => setLocalEmail("")}
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>

        <span className="self-center text-center">@</span>

        {/* 직접입력 또는 도메인 선택 */}
        <div className="relative w-full sm:w-[240px]" ref={domainRef}>
            <input
              type="text"
              placeholder="직접입력"
              value={customInput ? domain : (domain || "")}
              onChange={(e) => {
                if (!customInput) return;
                setDomain(e.target.value);
              }}
              className="w-full h-[49px] border border-gray-300 px-3 py-2 text-sm text-gray-500"
              // 포커스하면 바로 직접입력 됨
              onFocus={()=> {
                if(!customInput) {
                  setCustomInput(true);
                  setDomain("");
                }
              }}
              readOnly={!customInput}
              tabIndex={2}
            />

            <button
              type="button"
              onClick={() => setShowDropdown((v)=> !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
              tabIndex={-1}
            >
                <img
                  src={showDropdown ? "UpArrow.svg" : "DownArrow.svg"}
                  alt="드롭다운 아이콘"
                  className="w-4 h-4 border-none"
                />
              </button>
  
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md">
              {domainOptions.map((d) => (
                <div
                  key={d}
                  onClick={() => {
                    if(d === "직접입력"){
                      setCustomInput(true);
                      setDomain("");
                      setTimeout(() => {
                        (domainRef.current?.querySelector("input") as HTMLInputElement | null)?.focus();
                      }, 0);
                    }
                    else {
                      setCustomInput(false);
                      setDomain(d);
                    }
                    setShowDropdown(false);handleOptionClick(d)
                  }}
                  className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 자동 로그인 */}
      {showAutoLogin && (
        <label className="inline-flex items-center gap-2 mb-4 text-sm text-gray-600">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-[4px] border border-gray-400
              appearance-none checked:bg-[#0EA6C0] checked:border-[#0EA6C0]
              transition cursor-pointer"
            checked={autoLogin}
            onChange={onToggleAutoLogin}
            tabIndex={3}
            onKeyDown={(e)=>{
              if (e.key==="Enter"){
                e.preventDefault();           // 기본 제출/포커스 이동 방지
                onToggleAutoLogin();          // Enter로 선택/해제
              }
            }}
          />
          자동 로그인
        </label>
      )}

      {/* 버튼 */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFormValid() || isSubmitting}
        className={`w-full mb-12 text-white py-2 h-[49px] rounded-md text-sm font-medium
                    ${isFormValid() && !isSubmitting? "bg-[#0EA6C0] cursor-pointer" : "bg-[#B7E5EC] cursor-not-allowed"}`}
        tabIndex={4}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default EmailInput;
