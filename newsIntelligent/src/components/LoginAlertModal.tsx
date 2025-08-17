import { useEffect, useRef} from "react";



interface LoginAlertModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginAlertModal = ({ open, onClose }: LoginAlertModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
          if (!open) return; //모달이 닫혀있을 때는 작동 X
        
          const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (modalRef.current && !modalRef.current.contains(target)) { // 모달 영역 외부 클릭 감지
              onClose(); 
            }
          };
        
          document.addEventListener("mousedown", handleClickOutside); 
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [open, onClose]); 

        if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
      <div className="bg-white p-6 rounded-lg w-[380px] h-[240px] relative border-2 border-[#0EA6C0] shadow-[3px_5px_15px_rgba(0,0,0,0.35)]"
        ref={modalRef}>
        <button
          className="absolute top-2 right-2 text-gray-500 text-lg cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex flex-col items-center justify-center mt-12 h-[140px] gap-10">
            <p className="text-center mb-4 text-lg font-semibold">로그인이 필요한 기능입니다.</p>
            <button
            className="w-[300px] h-[54px] shadow-[3px_5px_15px_rgba(0,0,0,0.35)] border-2 border-[#0EA6C0] bg-[#F3FAFC] text-[#0EA6C0] font-semibold rounded py-2 cursor-pointer"
            onClick={() => {
                window.location.href = "/login";
            }}
            >
            로그인
            </button>
        </div>
        
      </div>
    </div>
  );
};

export default LoginAlertModal;
