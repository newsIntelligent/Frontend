import './App.css'
import Header from './components/Header'
import UpdatesSideBar from './components/UpdatesSideBar'
import Article from './components/Article'
import { useState, useEffect } from 'react'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)

  //스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 142) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Header />

      {/* 전체 페이지 너비 제한 */}
      <div className="flex justify-center bg-gray-50">
        <div className="related w-[1440px] flex">
          {/* 왼쪽: 고정 너비 사이드바 */}
          {/* <div className="sticky  w-[320px] pt-[167px]">
            <UpdatesSideBar />
          </div> */}

          <div
            className={`sticky  w-[320px] h-[calc(100vh-167px)] ${
              isScrolled ? 'top-[75px]' : 'top-[167px] '
            }`}
          >
            <UpdatesSideBar />
          </div>

          {/* 오른쪽: 가변 너비 본문 */}
          <div className="flex-1 pt-[167px] pl-12">
            <Article />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
