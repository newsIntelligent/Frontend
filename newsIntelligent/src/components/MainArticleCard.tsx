import { topicRead } from "../api/topic";
import SubscribeButton from "./SubscribeButton";

type MainArticleCardProps = {
  id: number;
  topicName: string;
  aiSummary: string;
  imageUrl: string;
  summaryTime: string;
}

function MainArticleCard({id, topicName, aiSummary, imageUrl, summaryTime}: MainArticleCardProps) {
  const formatTime = (iso: string) : string => {
    const time = new Date(iso);
    return time.toLocaleTimeString("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}
const handleClick = () => {
  topicRead(id);
}

  return (
  <div className="flex flex-col w-[410px] h-[265px] rounded-[8px] border border-[#919191] px-[26px] pt-[17px] pb-[21px]">
      <div className="flex justify-between items-center text-[12px] text-[#919191]">
        <span className="truncate w-[300px]">
          업데이트 {formatTime(summaryTime)} 
        </span>
        <SubscribeButton id={id}/>
      </div>


      <div className="flex gap-[12px] pt-[16px] items-center">
        <img
          src={imageUrl}
          alt="기사 이미지"
          className="w-[88px] h-[64px] object-cover rounded-[8px] cursor-pointer"
          onClick={handleClick}
        />
        <h2 className="text-[24px] font-semibold leading-7 break-keep line-clamp-2 cursor-pointer"
          onClick={handleClick}>
         {topicName}
        </h2>
      </div>
      <div className="w-full border-t border-[#E6E6E6] mt-[16px] mb-[12px]"/>
        <p className="w-[360px] font-normal text-[14px] leading-[24.5px] mb-[3px] line-clamp-3">
          {aiSummary}
        </p>
    </div>
  );
}

export default MainArticleCard;