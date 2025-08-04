import {Plus} from 'lucide-react'
import { useState } from 'react'
import SettingTimeModal from './SettingTimeModal';

const SettingTime = () => {
    const [isClick, setIsClick] = useState(false);
    const [times, setTimes] = useState<string[]>(['오전 11:00']);

    const click = () => {
        setIsClick(true);
    }

    const handleAddTime = (newTime : string) => {
        if (times.length < 3) {
            setTimes(prev => [...prev, newTime]);
        }

        setIsClick(false);
    }

    const handleRemoveTime = (index : number) => {
        setTimes(prev => prev.filter((_, i) => i !== index));
    }

    const hasTimes = times.length > 0;

    return (
        <div className={`flex items-center justify-center relative ${times.length > 0 ? "gap-2" : ""}`}>
            <div className='flex flex-wrap relative gap-2'>
                {times.map((time, index) => (
                    <button
                    key={index}
                    className="flex items-center justify-center pr-[4px] pl-[10px] font-medium text-[13px] border border-[#0EA6C0] text-[#0EA6C0] w-[104.28px] h-[28.28px] rounded-full">
                        <span> {time} </span>
                        <button onClick={() => handleRemoveTime(index)}>
                            <Plus size={11} strokeWidth={2} className='w-[20px] h-[20px] rotate-45' />
                        </button>
                    </button>
                ))}
            </div>

            {times.length < 3 && 
                (<div className='relative'>
                    <button 
                        onClick={click}
                        className={`flex items-center justify-center pr-[10px] pl-[6px] font-medium text-[13px] border border-[1px] border-[#0EA6C0] text-[#0EA6C0] w-[113px] h-[28px] rounded-full focus:outline-none transition-colors duration-200 ease-in-out
                        ${isClick ? "bg-[#0EA6C026]" : hasTimes ? "text-[#919191] border-[#919191]" : "bg-white"}`}>
                            <Plus size={11} strokeWidth={2} className='w-[20px] h-[20px]' />
                            <div className='w-[77px]'> 시간 추가하기 </div>
                    </button>
                </div>)
            }

            {isClick && 
            (<div className="absolute left-full ml-2 top-0 z-10">
                <SettingTimeModal onAdd={handleAddTime} onCancel={() => setIsClick(false)}/>
            </div>)
            }
        </div>
    )
}

export default SettingTime
