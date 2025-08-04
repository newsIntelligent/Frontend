import SearchIcon from "../assets/SearchIcon";

type SearchBarProps = {
  variant?: 'default' | 'mini'
}

function SearchBar({ variant = 'default' }: SearchBarProps) {
  const isMini = variant === 'mini'


    return (
        <div className={`relative group
            ${isMini ? 'w-[320px]': 'w-[499px]'} `}>
            <input
            type="text"
            className="peer w-full h-[40px] px-[20px] py-[12px] 
                border-[1.5px] border-[#919191]  rounded-[24px] outline-none
                focus:border-[#07525F] focus:border-[2px]"
          />
          <SearchIcon className="w-[24px] absolute right-[16px] top-1/2 -translate-y-1/2 text-[#919191] group-focus-within:text-[#07525F]"/>
        </div>
    )
    

}

export default SearchBar
