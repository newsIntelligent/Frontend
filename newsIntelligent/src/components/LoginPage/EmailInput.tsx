import { useState, useRef, useEffect } from "react";

interface EmailInputProps {
  onNext: (email: string) => void;
  autoLogin: boolean;
  onToggleAutoLogin:()=> void;
}

const EmailInput = ({ onNext, autoLogin, onToggleAutoLogin }: EmailInputProps) => {
  const [localEmail, setLocalEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [customInput, setCustomInput] = useState(true); // 직접입력을 기본값으로 설정
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const domainRef = useRef<HTMLDivElement>(null);

  const domainOptions = [
    "직접입력",
    "naver.com",
    "gmail.com",
    "daum.net",
    "hanmail.net",
    "nate.com",
  ];

  const handleSubmit = () => {
    if (!isFormValid()) return;
    setIsSubmitting(true);
    const pickedDomain = customInput ? domain.trim() : domain;
    const fullEmail = `${localEmail}@${pickedDomain}`;
    onNext(fullEmail);
  };

  const handleLocalEmailChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
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
    <div className="w-[500px]">
      {/* 입력폼 */}
      <div className="flex sm:mt-4 gap-2 mb-3">
        {/* 로컬 파트 입력 */}
        <div className="relative w-full sm:w-[240px]">
          <input
            type="text"
            placeholder="이메일 입력"
            value={localEmail}
            onChange={handleLocalEmailChange}
            className="w-full h-[49px] border border-gray-300 px-3 py-2 text-sm pr-8"
          />
          {localEmail && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
              onClick={() => setLocalEmail("")}
            >
              ×
            </button>
          )}
        </div>

        <span className="self-center">@</span>

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
            />

            <button
              type="button"
              onClick={() => setShowDropdown((v)=> !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
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
      <label className="inline-flex items-center gap-2 mb-4 text-sm text-gray-600">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-[4px] border border-gray-400
            appearance-none checked:bg-[#0EA6C0] checked:border-[#0EA6C0]
            transition cursor-pointer"
          checked={autoLogin}
          onChange={onToggleAutoLogin}
        />
        자동 로그인
      </label>

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid() || isSubmitting}
        className={`w-full mb-12 text-white py-2 h-[49px] rounded-md text-sm font-medium
                    ${isFormValid() && !isSubmitting? "bg-[#0EA6C0] cursor-pointer" : "bg-[#B7E5EC] cursor-not-allowed"}`}
      >
        이메일로 간편 로그인/회원가입
      </button>
    </div>
  );
};

export default EmailInput;
