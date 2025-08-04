import { useState } from "react";
import Notification from "./Notification";
import BellIcon from "../assets/BellIcon";
import ProfileIcon from "../assets/ProfileIcon";

function HeaderAction() {
  const [openNotification, setOpenNotification] = useState(false); // 알림창 열기
  const [newNotification, setNewNotification] = useState(false);   // 새 알림 여부
  const [isLogin, setIsLogin] = useState(false);                   // 로그인 상태
  const [showNotification, setShowNotification] = useState(false); // 알림 DOM 렌더링 여부

  const handleBellClick = () => {
    if (!openNotification) setShowNotification(true); // 열릴 때만 렌더
    setOpenNotification(!openNotification);
  };

  const handleNotificationClose = () => {
    setShowNotification(false); // 트랜지션 후 제거
  };

  const handleLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={`flex justify-between items-center gap-[28px] h-[40px] ${isLogin ? "w-[92px]" : "w-[166px]"}`}>
      {/* 🔔 알림 아이콘 */}
      <div className="relative">
        <BellIcon
          className={`w-[32px] cursor-pointer 
            ${newNotification ? "text-[#0B8E8E]" : ""} 
            ${openNotification ? "bg-[#0EBEBE1F] rounded-[20px]" : ""}`}
          onClick={handleBellClick}
        />
        {newNotification && (
          <span className="absolute top-[2px] right-[1px] w-[12px] h-[12px] bg-[#0B8E8E] rounded-full" />
        )}
        {showNotification && (
          <Notification
            isOpen={openNotification}
            setNotification={setNewNotification}
            onClose={handleNotificationClose}
          />
        )}
      </div>

      {/* 👤 로그인/회원가입 or 프로필 */}
      {isLogin ? (
        <ProfileIcon className="w-[32px] cursor-pointer" />
      ) : (
        <button
          onClick={handleLogin}
          className="w-[126px] h-[40px] inline-flex items-center justify-center
            rounded-[28px] border border-[#0EA6C0] px-[10px]
            text-center text-sm text-[#0EA6C0] hover:bg-[#0EA6C026] whitespace-nowrap"
        >
          로그인/회원가입
        </button>
      )}
    </div>
  );
}

export default HeaderAction;
