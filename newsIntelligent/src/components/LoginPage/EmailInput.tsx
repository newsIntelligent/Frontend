import { useState, useRef, useEffect } from "react";

interface EmailInputProps {
  onNext: (email: string) => void;
  autoLogin: boolean;
  onToggleAutoLogin:()=> void;
}

const EmailInput = ({ onNext, autoLogin, onToggleAutoLogin }: EmailInputProps) => {
  const [localEmail, setLocalEmail] = useState("");
  const [domain, setDomain] = useState("직접입력");
  const [customInput, setCustomInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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
    const fullEmail = `${localEmail}@${domain}`;
    onNext(fullEmail);
  };

  const handleLocalEmailChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
    const filtered = value.replace(/[^a-zA-Z0-9]/g,"");  //영어로 제한
    setLocalEmail(filtered);
  };

  const isFormValid = () => {
    if (!localEmail) return false;
    if (customInput) return domain.trim() !=="";
    return domain !== "직접입력";
  };

  const handleOptionClick = (option: string) => {
    if (option === "직접입력") {
      setCustomInput(true);
      setDomain("");
    } else {
      setCustomInput(false);
      setDomain(option);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        domainRef.current &&
        !domainRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        if (customInput) {
          setDomain("직접입력");
          setCustomInput(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [customInput]);

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

        {/* 도메인 선택 또는 직접입력 */}
        <div className="relative w-full sm:w-[240px]" ref={domainRef}>
          {customInput ? (
            <input
              type="text"
              placeholder="직접입력"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full h-[49px] border border-gray-300 px-3 py-2 text-sm text-gray-500"
              autoFocus
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full h-[49px] border border-gray-300 px-3 py-2 text-sm text-left relative text-gray-500"
            >
              {domain}
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <img
                  src={showDropdown ? "/Vector-up.svg" : "/Vector-down.svg"}
                  alt="드롭다운 아이콘"
                  className="w-4 h-4"
                />
              </span>
            </button>
          )}
          {showDropdown && !customInput && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md">
              {domainOptions.map((d) => (
                <div
                  key={d}
                  onClick={() => handleOptionClick(d)}
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
        disabled={!isFormValid()}
        className={`w-full mb-12 text-white py-2 h-[49px] rounded-md text-sm font-medium
                    ${isFormValid() ? "bg-[#0EA6C0] cursor-pointer" : "bg-[#B7E5EC] cursor-not-allowed"}`}
      >
        이메일로 간편 로그인/회원가입
      </button>
    </div>
  );
};

export default EmailInput;
