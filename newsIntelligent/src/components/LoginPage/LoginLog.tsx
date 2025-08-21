import LoginButton from "./LoginButton";

interface LoginLogProps {
    onSelect: (email: string, name: string) =>void;
}

const LoginLog = ({onSelect}:LoginLogProps) => {
  const token = localStorage.getItem("accessToken");
  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;

  // 토큰이 없어도 userInfo만 있으면 노출
  if (!user) return null;

  return (
    <div className="w-full max-w-[500px] h-auto min-h-[129px] flex flex-col justify-items-start">
      <p className="font-semibold">이미 로그인하셨네요!</p>
      <div className="flex flex-col sm:flex-row items-center justify-between w-full border border-gray-300 rounded-md p-4 bg-white mt-6 mx-auto gap-4">
        <div className="flex items-center gap-4">
          <img src={user.profileImageUrl || undefined} alt="프로필" className="w-[50px] h-[50px] rounded-full object-cover" />
          <div className="flex flex-col">
            <p className="font-semibold">{user.name} 님</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
        
        <div onClick={()=> onSelect(user.email, user.name)}>
            <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginLog;
