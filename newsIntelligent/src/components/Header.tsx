import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import HeaderAction from './HeaderAction'

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('IT/과학')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 142)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menus = ['홈', '정치', '경제', '사회', '생활/문화', 'IT/과학', '세계']

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C1C1C1] 
      ${isScrolled ? 'h-[50px]' : 'h-[142px] pt-[16px]'} w-full flex justify-center overflow-x-clip`}
    >
      <div className="w-[1440px] px-[104px] flex flex-col justify-between gap-[16px]">
        {isScrolled ? (
          <div className="flex justify-between items-center h-14">
            <img src="/src/assets/logo.svg" alt="Logo" className="w-48" />
            <SearchBar variant="mini" />
            <HeaderAction />
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {/* 로고 + 검색 */}
            <div className="flex justify-between h-[65px] items-center">
              <img src="/src/assets/logo.svg" alt="Logo" className="w-[342px] h-[65px]" />
              <SearchBar variant="default" />
            </div>

            {/* 메뉴바 */}
            <nav className="flex justify-between w-full h-[44px]">
              <div className="flex gap-x-6">
                {menus.map((menu) => (
                  <button
                    key={menu}
                    onClick={() => setActiveTab(menu)}
                    className={`relative h-11 px-2 py-3 text-sm font-['Pretendard Variable'] ${
                      activeTab === menu
                        ? 'text-[#07525F] font-semibold border-b-2 border-[#07525F]'
                        : 'text-[#1D1D1D]'
                    }`}
                  >
                    {menu}
                  </button>
                ))}
              </div>
              <HeaderAction />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
