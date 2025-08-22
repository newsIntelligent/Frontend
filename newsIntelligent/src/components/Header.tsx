import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import HeaderAction from "./HeaderAction";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigation = useNavigate();
  const {pathname} = useLocation();

  const handleLogoClick = () => {
    navigation("/");
  } 

  //스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 142) { setIsScrolled(true); } 
      else { setIsScrolled(false);  }
    };

   window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    }, []);

  const menus = ["홈", "정치", "경제", "사회", "생활/문화", "IT/과학", "세계"];
    
  return(
    <header
  className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C1C1C1]
  ${isScrolled ? "h-[60px]" : "h-[142px] pt-[16px]"} `}
>
  <div className="w-[1440px] flex flex-col pb-0 px-[max(16px,calc((100vw-1227px)/2))]">
    {isScrolled ? (
      <div className="flex justify-between items-center h-[60px] gap-[300px]">
        <img src="/SmallLogo.svg" alt="Logo" className="w-[42px]" onClick={handleLogoClick}/>
        <SearchBar variant="default" />
        <HeaderAction />
      </div>
    ) : (
      <div className="flex flex-col gap-y-2 justify-between ">
        <div className="flex justify-between items-center h-[70px] gap-[272px]">
          <img src="/HeaderLogo.svg" alt="Logo" className="w-[456px] h-[70px]" onClick={handleLogoClick}/>
          <SearchBar variant="default" />
        </div>

        <div className="flex justify-between items-center h-[44px] gap-[627px]">
        <nav className="flex w-[508px] gap-x-6 ">
                {menus.map((menu) => {
                  const isEconomyActive = menu === "경제" && pathname === "/"; 
                  return (
                    <button
                      key={menu}
                      className={`relative h-11 px-2 text-sm whitespace-nowrap ${
                        isEconomyActive
                          ? "text-[#07525F] font-semibold border-b-2 border-[#07525F]"
                          : "text-[#1D1D1D]"
                      }`}
                      onClick={menu === "경제" ? () => navigation("/") : undefined}
                    >
                      {menu}
                    </button>
                  );
                })}
              </nav>
          <HeaderAction />
        </div>
      </div>
    )}
  </div>
</header>
  )
}

export default Header;