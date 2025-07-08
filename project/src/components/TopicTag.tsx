import { useEffect, useState } from "react";
import XIcon from "../icon/XIcon";
import PlusIcon from "../icon/PlusIcon";

function TopicTag({selectedTag}: {selectedTag: (tag: string | null) => void}) {
    const [tagSelected, setTagSelected] = useState(true);

    useEffect(() => {
        selectedTag('경제'); 
    }, [])

    
    const handleTagClick = () => {
        const nextTag = !tagSelected 
        setTagSelected(nextTag);
        selectedTag(nextTag? '경제' : null);
    };

    return(
        <div className={`flex items-center justify-between w-[105px] h-[26px] rounded-[4px] 
                py-[4px] pr-[6px] pl-[10px] gap-[4px] border bg-white
                transititon-all duration-300
                ${tagSelected ? 'border-[#0EA6C0] text-[#0EA6C0]': 'border-[#C1C1C1] text-[#C1C1C1]'} `}>
            <p className="text-xs font-semibold leading-none text-center">경제 페이지</p>

            {tagSelected ? (
                    <XIcon className="w-[16px]" onClick={handleTagClick} />)
                : (<PlusIcon className="w-[16px]" onClick={handleTagClick} />)}

            
        </div>

    )
}


export default TopicTag;