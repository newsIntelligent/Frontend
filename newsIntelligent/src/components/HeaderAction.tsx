import { useEffect, useState } from "react";
import Notification from "./Notification";
import BellIcon from "../assets/BellIcon";
import ProfileIcon from "../assets/ProfileIcon";
import { useLocation, useNavigate } from "react-router-dom";
import LoginAlertModal from "./LoginAlertModal";

function getAccessTokenFromStorage() {
  const token = localStorage.getItem("accessToken");
  if (token) return token;
}


function HeaderAction() {
  const [openNotification, setOpenNotification] = useState(false); //알림창 열기
  const [newNotification, setNewNotification] = useState(false); //새로운 알람이 있으면 true
  const [isLogin, setIsLogin] = useState(true); //로그인 상태 구분
  const [showNotification, setShowNotification] = useState(false); //DOM 렌더링 여부
  const navigation = useNavigate();
  const { pathname } = useLocation();

  const isMypage = pathname === "/subscriptions"
    || pathname === "/settings"
    || pathname === "/notification"
    || pathname === "/read-topic"
    || pathname === "/settings/changes";



  const handleBellClick = () => {
    if (!openNotification) {
      setShowNotification(true); // 열 때만 바로 렌더
    }
    setOpenNotification(!openNotification);
  };

  const handleNotificationClose = () => {
    setOpenNotification(false); // 알림창 닫기
    // 트랜지션이 끝난 후 DOM에서 제거하기 위해 약간의 지연
      setShowNotification(false);
  };

  const handleLogin = () => {
    navigation('/login'); //로그인 페이지로 이동
    setIsLogin(true); //로그인 상태로 변경
  }
  const handleProfileClick = () => {
    navigation('/subscriptions'); //프로필 클릭 시 설정 페이지로 이동
  }

  useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (!token) {
      setIsLogin(false); // 로그인 상태가 아니면 false로 설정
    }
    setOpenNotification(false); 
    setShowNotification(true); // 컴포넌트가 마운트될 때 알림창 닫기
  }, [])


  return (
    <div className={`flex h-[40px]} gap-[28px]
              ${isLogin ? 'w-[92px]' : 'w-[166px]'}`}>
      <div className="relative">
        <BellIcon
          className={`w-[32px] cursor-pointer 
                          ${newNotification ? 'text-[#0B8E8E]' : ''}
                          ${openNotification ? 'bg-[#0EBEBE1F] rounded-[20px]' : ''}`}
          onClick={handleBellClick} />
        {newNotification && <span className="absolute top-[2px] right-[1px] w-[12px] h-[12px] bg-[#0B8E8E] rounded-full" />}
        {showNotification && isLogin && (
          <Notification isOpen={openNotification} setNotification={setNewNotification} onClose={handleNotificationClose} />
        )}
        {showNotification && !isLogin && (
          <LoginAlertModal open={openNotification} onClose={() => setOpenNotification(false)} />
        )}
      </div>
      {isLogin
        ? <ProfileIcon
          className={`w-[32px] cursor-pointer ${isMypage ? 'bg-[#0EBEBE1F] rounded-[20px]' : ''}`}
          onClick={handleProfileClick}
        />
        : <button className="w-[126px] h-[36px] inline-flex items-center justify-center
                    rounded-[28px] border border-[#0EA6C0] px-[10px] 
                    text-center text-sm text-[#0EA6C0] hover:bg-[#0EA6C026] whitespace-nowrap"
          onClick={handleLogin}>로그인/회원가입</button>}

    </div>
  )
}

export default HeaderAction;