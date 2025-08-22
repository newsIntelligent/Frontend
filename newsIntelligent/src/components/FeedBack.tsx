import { useEffect, useRef, useState } from "react";
import TopicTag from "./TopicTag";
import Chatting from "./Chatting";
import ChatIcon from "../assets/ChatIcon";
import { postFeedback } from "../api/feedback";
import { useMutation } from "@tanstack/react-query";

type Chatmessage = {   
    text: string;
    isUser?: boolean;
    tag?: string | null;
}

function FeedBack() {
    const [openFeedback, setOpenFeedback] = useState(false);
    const [message, setMessage] = useState<Chatmessage[]>([
        
            { text: "안녕하세요. \n 뉴스 인텔리전트 서비스를 이용해주셔서 감사합니다.\n\n 더 나은 서비스를 위해, 피드백을 제공해주세요.",
              isUser: false,
            }, ]
        
    )
    const [inputText, setInputText] = useState("");
    const [tag, setTag] = useState<string | null>(null);
    const feedbackRef = useRef<HTMLDivElement | null>(null);

    const sending = useMutation ({
        mutationFn: async() => postFeedback(inputText),
        onMutate: () => {
            setMessage(prevMessages => [
                ...prevMessages,
                { text: inputText, isUser: true, tag: tag }

            ]);
        },
        onSuccess: () => {
            setMessage(prevMessages => [
                ...prevMessages,
                { text: "피드백이 정상적으로 전송되었습니다.\n 감사합니다.", isUser: false }
            ]);
            setInputText("");
        },
        onError: () => {
            setMessage(prevMessages => [
                ...prevMessages,
                { text: "피드백 전송에 실패했습니다.", isUser: false }
            ]);
            setInputText("");
        }
    })
  
    const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { 
          e.preventDefault();          
          sending.mutate();      
        }
      };

      useEffect(() => {
        if (!openFeedback) return; //피드백이 닫혀있을 때는 작동 X
      
        const handleClickOutside = (e: MouseEvent) => {
          const target = e.target as Node;
          if (feedbackRef.current && !feedbackRef.current.contains(target)) { // 피드백 영역 외부 클릭 감지
            setOpenFeedback(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside); 
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [openFeedback]); 
  

      

    return(
        <div className="fixed bottom-[69px] right-[141px] z-50 flex flex-col items-end gap-[8px]"
        ref={feedbackRef}>  
            {openFeedback && 
                <div className="flex flex-col w-[380px] shadow-[2px_4px_8px_0px_rgba(0,0,0,0.15)] backdrop-blur-lg rounded-t-[16px]"
                   >
                    <div className="flex flex-col w-full h-[78px] rounded-t-[16px] bg-[#0EA6C0] pl-[33px] pt-[16px] text-white gap-[-6px]">
                        <div className="font-bold text-[16px h-[28px]">의견 창구</div>
                        <div className="font-semibold text-[12px] h-[28px]">더 나은 서비스를 위해 의견을 보내주세요</div>
                    </div>
                    <div className={`flex flex-col w-full h-[511px]`}>
                        <div className="w-full h-[390px]  bg-[#FFFFFFE5] relative ">
                            <div className={`h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden`}>
                            <Chatting messages={message} />
                            </div>
                            
                            <div className="absolute left-[12px] bottom-[8px]">
                                <TopicTag selectedTag={(tag) => setTag(tag)} />
                            </div>
                        </div>
                        <textarea className="w-full h-[121px] bg-white border border-[#E6E6E6] p-[12px] relative focus:outline-none text-sm
                            placeholder:text-[#919191] font-normal leading-none resize-none "
                            autoFocus
                            placeholder="메세지 입력"
                            value={inputText}
                            onChange={(e)=>setInputText(e.target.value)}
                            onKeyDown={onKeyPress}/>
                        <button className="w-[59px] h-[30px] rounded-[4px] px-[16px] py-[6px] bg-[#0EA6C0]
                            absolute right-[5px] bottom-[7px]  text-white text-[12px] text-center leading-none"
                            onClick={() => sending.mutate()}>
                            전송 </button>
                    </div>
                </div>
            }
            
            <div 
                className={`w-[72px] h-[72px] rounded-[40px] border-[2px] border-[#0EA6C0] p-[14px] 
                    flex justify-center items-center cursor-pointer shadow-[2px_4px_6px_0px_rgba(0,0,0,0.20)]
                    ${openFeedback? 'bg-[#0EA6C0]  backdrop-blur-[3px] ':'bg-white/50 backdrop-blur-[3px] hover:bg-[#0EBEBE1A]'}`}
                onClick={()=>{setOpenFeedback(!openFeedback)}}>
                <ChatIcon className={`w-[44px] ${openFeedback? 'text-white':'text-[#0EA6C0]'}`}/>
            </div>
        </div>
    )
}

export default FeedBack;