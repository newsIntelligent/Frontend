import { useState } from "react";
type SubscribeButtonProps = {
    sub: boolean;
    size?: 'default' | 'large';
}

function SubscribeButton({sub, size = "default"}: SubscribeButtonProps) {
    const [isSubscribed, setIsSubscribed] = useState(sub);

    const handleSubscribe = () => {
        setIsSubscribed(!isSubscribed);
    }

  return (
    <button className={`
      ${size === 'default' ? 'w-[50px] h-[20px] text-xs' : 'w-[76px] h-[32px] text-[16px]'}
        rounded-[20px] border text-center font-semibold 
        active:ring-[4px] active:ring-[#0EA6C033] active:text-white active:bg-[#0EBEBE66] active:border-none
        transform cursor-pointer
        ${isSubscribed  
            ? 'border-[#919191] text-[#919191]'
            :'bg-transparent border-[#0EA6C0] text-[#0EA6C0] hover:bg-[#0EBEBE26]'}
       `}
        onClick={handleSubscribe}>
      {isSubscribed ? '구독 중' : '+ 구독'}
    </button>
  );
}

export default SubscribeButton;