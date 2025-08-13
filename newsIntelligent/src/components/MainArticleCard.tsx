import { topicRead } from "../api/topic";
import SubscribeButton from "./SubscribeButton";

type MainArticleCardProps = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  imageSource: string;
  updatedAt: string;
  idSub: boolean;
}

function MainArticleCard({id, title, content, imageUrl, imageSource, updatedAt, idSub}: MainArticleCardProps) {
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
  <div className="flex flex-col w-[410px] h-[265px] rounded-[8px] border border-[#919191] px-[26px] pt-[17px] pb-[21px]"
    onClick={handleClick}>
      <div className="flex justify-between items-center text-[12px] text-[#919191]">
        <span className="truncate w-[300px]">
          업데이트 {formatTime(updatedAt)} · 이미지 {imageSource}
        </span>
        <SubscribeButton id={id} sub={idSub}/>
      </div>


      <div className="flex gap-[12px] pt-[16px] align-center">
        <img
          src={imageUrl}
          alt="기사 이미지"
          className="w-[88px] h-[64px] object-cover rounded-[8px]"
        />
        <h2 className="text-[24px] font-semibold leading-7 break-keep">
         {title}
        </h2>
      </div>
      <div className="w-full border-t border-[#E6E6E6] mt-[16px] mb-[12px]"/>
        <p className="w-[360px] font-normal text-[14px] leading-[24.5px] mb-[3px] line-clamp-3">
          {content}
        </p>
    </div>
  );
}

export default MainArticleCard;