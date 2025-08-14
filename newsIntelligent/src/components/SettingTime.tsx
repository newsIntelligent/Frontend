import {Plus} from 'lucide-react'
import { useState } from 'react'
import SettingTimeModal from './SettingTimeModal';
import { postSetDailyReport } from '../apis/members';

const formatToMeridiem = (time: string) => {
    const [hourStr, minute] = time.split(":");

    let hour = parseInt(hourStr, 10);

    const meridiem = hour < 12 ? "오전" : "오후";

    if (hour === 0) {
        hour = 12; 
    } 
    
    else if (hour > 12) {
        hour -= 12; 
    }

    return `${meridiem} ${hour.toString().padStart(2, "0")}:${minute}`;
};

const SettingTime = () => {
    const [isClick, setIsClick] = useState(false);
    const [times, setTimes] = useState<string[]>(['11:00']);

    const click = () => {
        setIsClick(true);
    }

    const handleAddTime = async (newTime : string) => {
        console.log("서버로 보낼 newTime:", newTime);

        if (times.length < 3) {
            try {
                await postSetDailyReport(newTime);

                setTimes(prev => [...prev, newTime]);
            } 
            
            catch (e: any) {
                console.log('요청 페이로드:', { time: newTime });
                console.log('응답 상태:', e.response?.status);
                console.log('응답 바디:', e.response?.data);
            }
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
                        <span> {formatToMeridiem(time)} </span>
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
