import { Cross, CrossIcon, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import SettingTimeModal from './SettingTimeModal';

const SettingTime = () => {
    const [isClick, setIsClick] = useState(false);
    const [times, setTimes] = useState<string[]>([]);

    const click = () => {
        setIsClick(true);
    }

    const handleAddTime = (newTime : string) => {
        setTimes(prev => [...prev, newTime]);
        setIsClick(false);
    }

    const hasTimes = times.length > 0;

    return (
        <div className='flex flex-1'>
            <div className="flex flex-col gap-2 items-center justify-center">
                {times.map((time, index) => (
                    <button
                    key={index}
                    className={`flex mt-4 gap-1 items-center justify-center font-medium text-[13px] border border-[1px] border-[#0EA6C0] text-[#0EA6C0] w-[113px] h-[28px] rounded-full focus:outline-none transition-colors duration-200 ease-in-out
                    ${isClick ? "bg-[#0EA6C026]" : "bg-white"}`}>
                        {times}
                        <X size={11} strokeWidth={2} className='w-[20px] h-[20px]' />
                    </button>
                ))}
            </div>

            <div className="">
                <button 
                onClick={click}
                className={`flex mt-4 pl-[6px] pr-[10px] items-center justify-center font-medium text-[13px] border border-[1px] border-[#0EA6C0] text-[#0EA6C0] w-[113px] h-[28px] rounded-full focus:outline-none transition-colors duration-200 ease-in-out
                ${isClick ? "bg-[#0EA6C026]" : hasTimes ? "text-[#919191] border-[#919191]" : "bg-white"}`}>
                    <Plus size={11} strokeWidth={2} className='w-[20px] h-[20px]' />
                    <div className='w-[77px]'> 시간 추가하기 </div>
                </button>
            </div>

            {isClick && <SettingTimeModal onAdd={handleAddTime} onCancel={() => setIsClick(false)}/>}
        </div>
    )
}

export default SettingTime
