import { createSearchParams, useNavigate } from "react-router-dom";
import { topicRead } from "../api/topic";
import SubscribeButton from "./SubscribeButton";
import type { MainArticleCardProps } from "../types/article";


function MainArticle({id, topicName, aiSummary, imageUrl, summaryTime, imageSource}: MainArticleCardProps) {

    const formatTime = (iso: string): string => {
        const time = new Date(iso)
        const mm = time.getMonth() + 1
        const dd = time.getDate()
        const hh = time.getHours()
        const mi = time.getMinutes()
    
        return `${mm}/${dd} ${hh}:${mi}`
      }

    const navigate = useNavigate();

    const handleClick = () => {
        topicRead(id);
        navigate({
            pathname: "/article",
            search: `?${createSearchParams({ id: String(id) })}`,
        })
    }

    return(
        <div className="flex flex-col items-center justify-center w-[840px] min-h-[368px] 
            border-y-[3px] border-[#000000]">
                <div className="flex items-center justify-between w-full pr-[26px] pt-[39px] pb-[6px] gap-[30px]">
                    <img
                        src={imageUrl}
                        alt="기사 이미지"
                        className="w-[476px] h-[278px] object-cover cursor-pointer"
                        onClick={handleClick}
                    />
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col items-start justify-between gap-[12px]">
                            <div className="text-4xl font-bold leading-[48px] w-[299px] line-clamp-2 overflow-hidden cursor-pointer"
                            onClick={handleClick}>
                                {topicName}
                            </div>
                           <SubscribeButton id={id} size="large"/>  
                        </div>
                        <p className="w-[333px] text-[14px] font-normal leading-normal line-clamp-5">
                        {aiSummary}
                        </p>
                    </div>
                </div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] ">이미지 · {imageSource?.press}  <a className="underline" > "{imageSource?.title}"</a></div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] mb-[8px] text-right">업데이트 {formatTime(summaryTime)}</div>
        </div>
    )
}

export default MainArticle;