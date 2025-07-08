import SubscribeButton from "./SubscribeButton";

type MainArticleCardProps = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    imgSource: string;
    updatedAt: string;
  }

function MainArticle({title, description, imageUrl, imgSource, updatedAt}: MainArticleCardProps) {
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
                            <SubscribeButton size="large"/>
                        </div>
                        <p className="w-[333px] text-[14px] font-normal leading-normal line-clamp-5">
                        {description}
                        </p>
                    </div>
                </div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] pt-[6px]">이미지 · 조선일보{imgSource}</div>
                <div className="w-full h-[20px] text-[10px] text-[#919191] mb-[8px] text-right">업데이트 {updatedAt}</div>
        </div>
    )
}

export default MainArticle;