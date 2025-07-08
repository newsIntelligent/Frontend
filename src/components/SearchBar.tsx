type SearchBarProps = {
    variant? : 'default' | 'mini';
}

function SearchBar({variant = 'default'}:SearchBarProps) {
    const isMini = variant === 'mini';

    return (
        <div className={`relative
            ${isMini ? 'w-[320px]': 'w-[499px]'}`}>
            <input
            type="text"
            className="peer w-full h-[40px] px-[20px] py-[12px] 
                border border-[1.5px] border-[#919191]  rounded-[24px] outline-none
                focus:border-[#07525F] focous:border-[2px]"
          />
          <img src="/src/assets/search.svg" 
            className="w-[24px] absolute right-[16px] top-1/2 -translate-y-1/2" />
        </div>
    )
    
}

export default SearchBar;