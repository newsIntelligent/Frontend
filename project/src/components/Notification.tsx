import { useState } from "react";
import VectorIcon from "../icon/VectorIcon";

function Notification() {

  const [check, setCheck] = useState(false);
  //일단 오류 무시 
 

  return (
    <div className="absolute right-0 top-full mt-2 w-[440px] max-h-[400px] 
        bg-white rounded-t-[10px] border border-[#C1C1C1] z-50
        flex flex-col ">
      <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold  text-[#919191]">
        <span>새로운 알림 <span className="text-[#0B8E8E]">n</span>개</span>
        <div className="flex justify-between gap-6">
        <button 
            className="w-20 h-6 rounded-xl border border-[#E6E6E6] items-center gap-1 hover:bg-[#E6E6E6]
                text-xs font-semibold">모두 읽음</button>
        <VectorIcon className="w-5"/>
        </div>
      </div>
      <ul>
        <li className="flex justify-between h-11 gap-3 px-[12px] py-[6px] 
          border-b border-b-[#E6E6E6] border-b-2">
            <div className="flex justify-start items-center gap-2.5">
              <div className="w-14 h-5 px2.5 bg-[#0EA6C01A] rounded-[20px] 
                text-center text-[#0B8E8E] text-xs font-semibold "> 구독 </div>
              <div className="justify-center text-sm">
                <span className="text-[#0B8E8E]">'SKT 유심'</span>
                의 새로운 업데이트가 있습니다.
              </div>
            </div>
            <div className="w-8 text-right justify-center text-500 text-xs">23:08</div>
        </li>
        <li className="flex justify-between h-11 gap-3 px-[12px] py-[6px] 
          border-b border-b-[#E6E6E6] border-b-2">
            <div className="flex justify-start items-center gap-2.5">
              <div className="w-14 h-5 px2.5 bg-[#0EA6C01A] rounded-[20px] 
                text-center text-[#0B8E8E] text-xs font-semibold "> 구독 </div>
              <div className="justify-center text-sm">
                <span className="text-[#0B8E8E]">'SKT 유심'</span>
                의 새로운 업데이트가 있습니다.
              </div>
            </div>
            <div className="w-8 text-right justify-center text-500 text-xs">23:08</div>
        </li>
      </ul>
    </div>
  );
}

export default Notification;