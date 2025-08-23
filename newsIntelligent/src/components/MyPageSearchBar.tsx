import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";

interface MyPageSearchBarProps {
    onSearch : (query : string) => void;
}

const MyPageSearchBar = ({onSearch} : MyPageSearchBarProps) => {
    const [input, setInput] = useState("");

    const debouncingSearch = useCallback(_.debounce((value : string) => {
        onSearch(value);
    }, 500)
    , []);

    const throttlingSearch = useRef(_.throttle((value?: string) => {
        onSearch(value ?? "");
    }, 2000)).current;

    useEffect(() => {
        debouncingSearch(input);
        throttlingSearch(input);
    }, [input])

    const handleClick = () => {
        onSearch(input);
    }

    return (
        <div className="flex border-[1.5px] border-[#919191] w-[320px] h-[40px] rounded-full items-center">
            <input 
            className="w-[90%] ml-4 focus:outline-none"
            placeholder=""
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />

            <button className="pr-[20px]" onClick={handleClick}>
                <Search className="text-[#919191]" strokeWidth={1}/>
            </button>
        </div>
    )
}

export default MyPageSearchBar
