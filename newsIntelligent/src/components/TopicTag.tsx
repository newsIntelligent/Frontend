import { useEffect, useState } from "react";
import XIcon from "../assets/XIcon";
import PlusIcon from "../assets/PlusIcon";
import { useLocation } from "react-router-dom";

function TopicTag({selectedTag}: {selectedTag: (tag: string | null) => void}) {
    const [tagSelected, setTagSelected] = useState(true);
    const location = useLocation();

    const pathTag: Record<string, string> = {
        "/": "메인",
        "/subscriptions": "구독",
        "/read-topic": "읽기",
        "/notification": "알림",
        "/settings": "설정",
        "/settings/changes": "설정 변경",
        "/article": "기사",
        "/login": "로그인"
    }

    useEffect(() => {
        const currentTag = pathTag[location.pathname] || null;
        selectedTag(currentTag);
    }, [location.pathname]);

    const handleTagClick = () => {
        const nextTag = !tagSelected;
        setTagSelected(nextTag);

        const currentTag = pathTag[location.pathname] || null;
        selectedTag(nextTag ? currentTag : null);
    };

    const currentTagLabel = pathTag[location.pathname] || "태그 없음";

    return(
        <div className={`flex items-center justify-between w-[105px] h-[26px] rounded-[4px] 
                py-[4px] pr-[6px] pl-[10px] gap-[4px] border bg-white
                transititon-all duration-300
                ${tagSelected ? 'border-[#0EA6C0] text-[#0EA6C0]': 'border-[#C1C1C1] text-[#C1C1C1]'} `}>
            <p className="text-xs font-semibold leading-none text-center whitespace-nowrap">{currentTagLabel} 페이지</p>

            {tagSelected ? (
                    <XIcon className="w-[16px]" onClick={handleTagClick} />)
                : (<PlusIcon className="w-[16px]" onClick={handleTagClick} />)}

            
        </div>

    )
}


export default TopicTag;