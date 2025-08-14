import { useState } from "react";
import { topicSubscribe, topicUnsubscribe } from "../api/topic";
import { useMutation } from "@tanstack/react-query";
type SubscribeButtonProps = {
    id: number;
    subscribe?: boolean; // 구독 상태, 기본값은 false
    size?: 'default' | 'large';
}

function SubscribeButton({id, size = "default", subscribe = false}: SubscribeButtonProps) {
    const [sub, setSub] = useState(subscribe); // 구독 상태 관리
    
    const toggleSubscribe = useMutation ({
      mutationFn: async (next: boolean) => {
        return next? topicSubscribe(id) : topicUnsubscribe(id);
      }, //next: 구독 상태 받음 true일때 구독

      onMutate: (next:boolean) => {setSub(next)}, //구독 상태 변경
      onError: (error, next) => {
        console.error("구독 상태 변경 실패:", error);
        setSub(!next); // 에러 발생 시 이전 상태로 되돌림
      }
    })
    

  return (
    <button className={`
      ${size === 'default' ? 'w-[50px] h-[20px] text-xs' : 'w-[76px] h-[32px] text-[16px]'}
        rounded-[20px] border text-center font-semibold 
        active:ring-[4px] active:ring-[#0EA6C033] active:text-white active:bg-[#0EBEBE66] active:border-none
        transform cursor-pointer
        ${sub
            ? 'border-[#919191] text-[#919191]'
            :'bg-transparent border-[#0EA6C0] text-[#0EA6C0] hover:bg-[#0EBEBE26]'}
            transition-all duration-300
       `}
        onClick={() => toggleSubscribe.mutate(!sub)}>
      {sub ? '구독 중' : '+ 구독'}
    </button>
  );
}

export default SubscribeButton;