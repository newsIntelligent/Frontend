import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import HeaderAction from './HeaderAction';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('IT/과학');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 142);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menus = ['홈', '정치', '경제', '사회', '생활/문화', 'IT/과학', '세계'];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#C1C1C1]
        transition-all duration-300
        ${isScrolled ? 'h-[60px]' : 'h-[142px] pt-[16px]'} flex justify-center`}
    >
      <div className="w-[1440px] px-[104px] flex flex-col transition-all duration-300">
        {isScrolled ? (
          <div className="flex justify-between items-center h-[60px]">
            <img src="/src/assets/smallLogo.svg" alt="Logo" className="w-[42px]" />
            <SearchBar variant="default" />
            <HeaderAction />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center h-[70px]">
              <img src="/src/assets/logo.svg" alt="Logo" className="w-[456px] h-[70px]" />
              <SearchBar variant="default" />
            </div>

            <div className="flex justify-between items-center h-[44px]">
              <nav className="flex gap-x-6">
                {menus.map((menu) => (
                  <button
                    key={menu}
                    onClick={() => setActiveTab(menu)}
                    className={`relative h-11 px-2 text-sm whitespace-nowrap font-['Pretendard Variable'] ${
