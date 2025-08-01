import { useEffect } from "react";
import HomeButton from "./HomeButton";

const LoginComplete = () => {
  useEffect(() => {
    // 임시 토큰 및 사용자 정보 저장
    localStorage.setItem("accessToken", "mock-token-123456");
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ name: "홍길동", email: "hong@test.com" })
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-white w-full flex flex-col items-center">
      {/* ✅ 상단 헤더 */}
      {/* <Header /> */}

      {/* ✅ 콘텐츠는 헤더 아래에 배치 */}
      <main className="flex flex-col items-center justify-center gap-6 pt-[180px] px-4">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[#CFEDFE] pointer-events-none" />
        <img src="Check.svg" alt="완료" className="w-[90px] h-[90px] z-10" />
        <p className="text-[#0EA6C0] font-semibold text-3xl mb-12 z-10">로그인 완료</p>
        <p className="font-semibold z-10 text-center leading-loose">
          환영합니다, 홍길동 님.
          <br />
          <br />
          <span className="text-[#0EA6C0]">구독한 주제, 키워드 알림, 읽은 토픽의 변경점</span>을
          <br />
          이메일로 알림 받으실 수 있습니다.
        </p>

        <HomeButton />
      </main>
    </div>
  );
};

export default LoginComplete;
