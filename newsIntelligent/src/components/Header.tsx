import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import HeaderAction from "./HeaderAction";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  //스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 142) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menus = ["홈", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계"];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C1C1C1]
    ${
      isScrolled ? "h-[50px]" : "h-[142px] pt-[16px]"
    } w-full flex justify-center overflow-x-clip`}
    >
      <div className="w-[1440px] px-[104px] flex flex-col justify-between gap-[16px]">
        {isScrolled ? (
          // 스크롤 시 헤더
          <div className="flex justify-between items-center h-14 ">
            <img src="/src/assets/logo.svg" alt="Logo" className="w-48" />
            <SearchBar />
            <HeaderAction />
          </div>
        ) : (
          // 기본 헤더
          <div className="flex flex-col gap-[16px]">
            {/*로고와 서치바*/}
            <div className="flex justify-between h-[65px] items-center">
              <img
                src="/src/assets/logo.svg"
                alt="Logo"
                className="w-[342px] h-[65px]"
              />
              <SearchBar variant="default" />
            </div>

            {/*메뉴*/}
            <nav className="flex justify-between w-full h-[44px] ">
              <div className="flex gap-x-6">
                {menus.map((menu) => (
                  <button
                    key={menu}
                    className={`relative h-11 px-2 py-3 text-sm font-['Pretendard Variable'] ${
                      menu === "경제"
                        ? "text-[#07525F] font-semibold border-b-2 border-[#07525F]"
                        : "text-[#1D1D1D] disabled"
                    }`}
                  >
                    {menu}
                  </button>
                ))}
              </div>
              {/*알림, 마이페이지 버튼 */}
              <HeaderAction />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
