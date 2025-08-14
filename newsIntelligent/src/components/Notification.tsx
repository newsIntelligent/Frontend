import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import useThrottle from "../hooks/useThrottle";
import VectorIcon from "../assets/VectorIcon";
import { checkAllNotification, checkNotification, getNotification } from "../api/notification";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../assets/notification.svg"




function Notification({ isOpen, setNotification, onClose }: { isOpen:boolean, setNotification: (value: boolean) => void, onClose?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [newNotification, setNewNotification] = useState(false); //읽지 않은 알람이 있으면 true
  const navigation = useNavigate();

  const {data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage} = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({pageParams}:any) => getNotification({cursor: pageParams, size: 10}),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor ?? undefined,
  })

  const{ref, inView} = useInView({
    threshold: 0,
    rootMargin: '200px'
  })
  const throttleInView = useThrottle(inView, 3000);

  useEffect(() => {
    if (throttleInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
      console.log("다음 알람 요청")
    }
  }, [throttleInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const notifications = data?.pages.flatMap((p) => p?.result?.notifications ?? []) ?? [];

  useEffect(() => {
    const hasUnread = notifications.some((item) => !item.is_checked);
    setNotification(hasUnread)
    setNewNotification(hasUnread);
  }, [data])




  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10); // 마운트 후 트랜지션 시작
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleAllCheck = () => {
    checkAllNotification();
    setNotification(false);
  }; //모두 확인

  const handleCheck = (id:number) =>{
    checkNotification(id);
  }; //알람 단건 확인

  const handleSettingClick = () => {
    navigation('/notification')
  }//알림 설정 페이지로 이동

  const highlightQuotedText = (text: string): React.ReactNode => {
    const regex = /'([^']+)'/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
  
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} className="text-[#0B8E8E]">
          '{match[1]}'
        </span>
      );
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
  
    return parts;
  };  //구독 토픽 강조

  const formatTime = (iso: string) : string => {
      const now = new Date();
      const target = new Date(iso);

      const diffTime = now.getTime() - target.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0 ) {
        return target.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        })
      } //하루 이내 알람은 시간으로 표시

      else return `${diffDays}일 전`; //하루가 지난 알람은 일수로 표시
  }; //알림 시간 표시 
  
  return (
    <div
      className={`absolute right-0 top-[48px] w-[440px] h-[400px] 
        bg-white rounded-t-[10px] border border-[#C1C1C1] z-50
        flex flex-col
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}
      `}
      onTransitionEnd={() => { if (!isOpen && onClose) onClose(); }}
    >
      <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold  text-[#919191]">
        { newNotification 
          ? <span>새로운 알림 <span className="text-[#0B8E8E]">{notifications.filter((ele)=>!ele.is_checked).length}</span>개</span>
          : <span>알림</span>}
        <div className="flex justify-between gap-6">
        <button 
            className="w-20 h-6 rounded-xl border border-[#E6E6E6] items-center gap-1 hover:bg-[#E6E6E6]
                text-xs font-semibold"
            onClick={handleAllCheck}>모두 읽음</button>
        <VectorIcon className="w-5 cusor-pointer"
          onClick={handleSettingClick}/>
        </div>
      </div>
      { notifications.length > 0
      //알림이 있는 경우
        ? <ul className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {notifications.map ((item) => (
           <li 
            key={item.noti_id} 
            className="flex justify-between h-11 gap-3 px-[12px] py-[6px] border-b border-b-[#E6E6E6]"
            onClick={() => handleCheck(item.noti_id)}>
             <div className="flex justify-start items-center gap-2.5">
               <div className={`w-14 h-5 px2.5 rounded-[20px] text-xs  text-center font-semibold
                  ${item.is_checked ? 'bg-[#F5F5F5] text-[#777777]':'bg-[#0EA6C01A] text-[#0B8E8E]'} `}> 
                    {item.noti_type === "SUBSCRIBE" ? '구독' : '토픽'} </div>
               <div className={`justify-center text-sm ${item.is_checked ? 'text-[#777777]':'text-black'}`}>
               {highlightQuotedText(item.content)}
               </div>
             </div>
             <div className={`w-8 text-right justify-center text-500 text-xs whitespace-nowrap ${item.is_checked ? 'text-[#777777]':'text-black'}`}>{formatTime(item.created_at)}</div>
             </li>
        ))}
        <div ref={ref} />
      </ul>
      : 
      //알림이 없는 경우 
      <div className="flex flex-col items-center justify-center h-full gap-[40px]">
          <img src={notificationIcon} alt="notification" className="w-[80px]"/>
          <div className="flex flex-col gap-[8px] items-center text-center">
            <p className="text-[#0EA6C0] text-[16px] font-semibold">여기에 알림이 표시됩니다.</p>
            <p className="text-[#919191] text-[14px] font-medium leading-[18px]">토픽을 구독하거나 키워드를 설정하여 <br/>
               업데이트 알림을 받아보세요.</p>
          </div>
      </div>
      }
      
      
    </div>
  );
}

export default Notification;

