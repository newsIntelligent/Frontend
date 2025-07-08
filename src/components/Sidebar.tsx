import { useState } from "react"
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isClick, setIsClick] = useState(false);

    const click = () => {
        setIsClick(!isClick);
    }

    return (
        <div className="flex flex-1 text-[#07525F] mt-[179px] w-[207px] h-[252px]">
            <div className="h-full pl-[24px] border-l-4 border-[#07525F]">
                <div className="flex flex-col gap-4">
                    <p className="text-2xl font-bold text-black"> 마이페이지 </p>

                    <div className="flex flex-col space-y-3">
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 주제 구독" : "주제 구독"} </button>
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 읽은 기사" : "읽은 기사"} </button>
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 활동" : "활동"} </button>
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 멤버쉽" : "멤버쉽"} </button>
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 신고" : "신고"} </button>
                        <button className={`text-base font-bold text-left ${isClick ? "text-[#07525F]" : "text-[#919191]"}`} onClick={click}> {isClick ? "· 알림 설정" : "알림 설정"} </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
