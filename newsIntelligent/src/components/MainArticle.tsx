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

function MainArticle({id, title, content, imageUrl, imageSource, updatedAt, idSub}: MainArticleCardProps) {
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

    return(
        <div className="flex flex-col items-center justify-center w-[840px] min-h-[368px] 
            border-y-[3px] border-[#000000]">
                <div className="flex items-center justify-between w-full pr-[26px] pt-[39px] pb-[6px] gap-[30px]">
                    <img
                        src={imageUrl}
                        alt="기사 이미지"
                        className="w-[476px] h-[278px] object-cover "
                    />
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-col items-start justify-between gap-[12px]">
                            <div className="text-4xl font-bold leading-[48px] w-[299px]">
                                {title}
                            </div>
                            <SubscribeButton id={id} sub={idSub} size="large"/>
                        </div>
                        <p className="w-[333px] text-[14px] font-normal leading-normal line-clamp-5">
                        {content}
                        </p>
                    </div>
                </div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] pt-[6px]">이미지 · {imageSource}</div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] mb-[8px] text-right">업데이트 {formatTime(updatedAt)}</div>
        </div>
    )
}

export default MainArticle;