import { Search } from "lucide-react";

const MyPageSearchBar = () => {
    return (
        <div className="flex border border-[1.5px] border-[#919191] w-[320px] h-[40px] rounded-full items-center">
            <input 
            className="w-[90%]"
            />

            <button className="pr-[20px]">
                <Search className="text-[#919191]" strokeWidth={1}/>
            </button>
        </div>
    )
}

export default MyPageSearchBar
