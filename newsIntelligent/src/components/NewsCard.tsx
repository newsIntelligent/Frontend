import { useState } from "react";
import SubscribeButton from "./SubscriptionButton";
import { ChevronDown, Circle } from "lucide-react";
import type { NewsItems } from "../types/subscriptions";

const NewsCard = ({data: _data} : {data : NewsItems}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDropdown = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`break-inside-avoid border border-[1px] border-[#919191] rounded-lg ${isExpanded ? "h-[597px]" : "h-[288px]"}`}>
            {isExpanded ? 
            (
                <div className="w-[410px] h-[595px]">
                    <div className="flex flex-col p-6 gap-4">
                        <div className="flex flex-1 justify-between">
                            <p className="text-[12px] font-[400px] text-[#919191]"> 업데이트 05/03 23:50 · 이미지 조선일보 “고양이가 크게 우...” </p>
                            <SubscribeButton />
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex">
                                <img
                                src="https://img1.newsis.com/2025/05/31/NISI20250531_0000380877_web.jpg"
                                alt="기사 이미지"
                                className="w-[88px] h-[964x] object-cover rounded-[8px] mr-[12px]"
                                />

                                <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                                    집 강아지 ‘콩이’의
                                    유행 시발점
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="w-[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">
                                    2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었의 유심(USIM) 관련 정보가 유출되었 의 유심(USIM) 관련 정보가 유출되었습니다. 꽉 채운 다음에서야 요...
                                </div>


                                <div className="mt-[8px] flex items-center justify-between">
                                    <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                                    <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200`}
                                    >
                                        <span> {isExpanded ? "접기" : "출처 기사 펼치기"} </span>
                                        <ChevronDown
                                        size={16}
                                        className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <div className="flex flex-1 gap-2 items-center">
                                        <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                                        <span className="text-[12px] font-regular text-[#919191]"> 연합신문 · 05/03 03:55 </span>
                                    </div>
                                    <span className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3"> 
                                    규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로 이어질 우려가 있습니다. 화성이 생각보다동해물과 백두산이 마르고 닳도록 ... 가나다라마바사아자차...
                                    </span>
                                </div>

                                <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <div className="flex flex-1 gap-2 items-center">
                                        <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                                        <span className="text-[12px] font-regular text-[#919191]"> 연합신문 · 05/03 03:55 </span>
                                    </div>
                                    <span className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3"> 
                                    규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로 이어질 우려가 있습니다. 화성이 생각보다동해물과 백두산이 마르고 닳도록 ... 가나다라마바사아자차...
                                    </span>
                                </div>

                                <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <div className="flex flex-1 gap-2 items-center">
                                        <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                                        <span className="text-[12px] font-regular text-[#919191]"> 연합신문 · 05/03 03:55 </span>
                                    </div>
                                    <span className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3"> 
                                    규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로 이어질 우려가 있습니다. 화성이 생각보다동해물과 백두산이 마르고 닳도록 ... 가나다라마바사아자차...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            :
            (
                <div className="w-[410px]">
                    <div className="flex flex-col m-6 gap-4">
                        <div className="flex flex-1 justify-between">
                            <p className="text-[12px] font-[400px] text-[#919191]"> 업데이트 05/03 23:50 · 이미지 연합뉴스 </p>
                            <SubscribeButton />
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex">
                                <img
                                src="https://img1.newsis.com/2025/05/31/NISI20250531_0000380877_web.jpg"
                                alt="기사 이미지"
                                className="w-[88px] h-[964x] object-cover rounded-[8px] mr-[12px]"
                                />

                                <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                                    집 강아지 ‘콩이’의
                                    유행 시발점
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="w-[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">
                                    2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었의 유심(USIM) 관련 정보가 유출되었 의 유심(USIM) 관련 정보가 유출되었습니다. 꽉 채운 다음에서야 요...
                                </div>


                                <div className="mt-[8px] flex items-center justify-between">
                                    <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                                    <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200`}
                                    >
                                        <span> {isExpanded ? "접기" : "출처 기사 펼치기"} </span>
                                        <ChevronDown
                                        size={16}
                                        className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default NewsCard

