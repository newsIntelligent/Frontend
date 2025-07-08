import logo from '..assets/logo.svg';
const LoginPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#DEF0F0] flex items-center justify-center">
      <div className="w-[1160px] h-[500px] bg-white rounded-[16px] p-8 shadow-md flex">
        {/* 왼쪽: 로고 + 설명 */}
        <div className="w-1/2 pl-8 pt-8">
          <img src={logo} alt="로고" className="w-[384px] h-[73px] mb-4" />
          <p className="text-sm text-[#666] leading-relaxed">
            회원가입 시<br />
            <span className="text-[#06525F]">구독한 주제, 키워드 알림, 원문 트래픽 변경점</span>을<br />
            이메일로 알림 받으실 수 있습니다.
          </p>
        </div>

        {/* 오른쪽: 입력 폼 */}
        <div className="w-1/2 flex flex-col justify-center items-end pr-12">
          <div className="w-[344px]">
            {/* 입력폼 */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="이메일 입력"
                className="w-[160px] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B0D9D9]"
              />
              <span className="self-center">@</span>
              <select className="w-[160px] border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#B0D9D9]">
                <option value="">직접입력</option>
              </select>
            </div>

            {/* 자동 로그인 */}
            <label className="inline-flex items-center mb-4 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#0B3B3C] mr-2" />
              자동 로그인
            </label>

            {/* 버튼 */}
            <button className="w-full bg-[#B0D9D9] text-white py-2 rounded hover:bg-[#9fcaca] text-sm font-medium">
              이메일로 간편 로그인/회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
