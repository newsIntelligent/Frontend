type ToggleButtonProps = {
    isOn : boolean;
    toggle : () => void;
}

const ToggleButton = ({isOn, toggle} : ToggleButtonProps) => {
    return (
        <div className='w-[58px] h-[27px]'>
            <button 
            onClick={toggle} 
            className={`relative items-center mt-[4px] w-[52px] h-[21px] inline-flex rounded-full focus:outline-none transition-colors duration-200 ease-in-out 
            ${isOn ? 'bg-[#0EA6C0]' : 'bg-[#C1C1C1]'}`}>
                <span 
                className={`inline-block w-[27px] h-[27px] transform rounded-full bg-white shadow-[1px_1px_2px_0px_#00000066] transition-transform duration-200 ease-in-out 
                ${isOn ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
        </div>
    )
}

export default ToggleButton
