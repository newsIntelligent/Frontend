import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SettingTimeModalProps = {
    onAdd : (time : string) => void;
    onCancel : () => void;
}

const SettingTimeModal = ({onAdd, onCancel} : SettingTimeModalProps) => {
    const [meridiem, setMeridiem] = useState<'오전' | '오후'>('오전');
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);

    const clickMeridiemn = () => {
        setMeridiem(prev => (prev === '오전' ? '오후' : '오전'));
    }

    const increaseHour = () => {
        setHour(prev => (prev === 12 ? 1 : prev + 1));
    }

    const decreaseHour = () => {
        setHour(prev => (prev === 1 ? 12 : prev - 1));
    }

    const increaseMinute = () => {
        setMinute(prev => (prev + 5 ) % 60);
    }
    const decreaseMinute = () => {
        setMinute(prev => (prev - 5 + 60) % 60);
    }

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    const handleAdd = () => {
        let time24 = hour;

        if (meridiem === '오전' && hour === 12) {
            time24 = 0;
        }

        else if (meridiem === '오후' && hour !== 12) {
            time24 = hour + 12;
        }

        const formatted = `${time24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        console.log("서버로 보낼 시간 (24시간제):", formatted);
        
        onAdd(formatted);  
    } 

    return (
        <div className="absolute bg-white flex w-[200px] h-[160px] pt-[10px] pr-[10px] pl-[10px] pb-[44px] rounded-[8px] shadow-[1px_1px_8px_0px_#00000040] items-center justify-center flex-col">
            <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <button 
                    className="rotate-180 text-[#C1C1C1] flex items-center justify-center"
                    onClick={clickMeridiemn}>
                        <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                    </button>

                    <span className="text-[16px] font-medium text-black"> 
                        {meridiem}
                    </span>

                    <button 
                    className="text-[#C1C1C1] flex items-center justify-center"
                    onClick={clickMeridiemn}>
                        <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                    </button>
                </div>

                <div className="flex flex-1 items-center gap-2">
                    <div className="flex flex-col items-center gap-2">
                        <button 
                        className="rotate-180 text-[#C1C1C1] flex items-center justify-center"
                        onClick={increaseHour}>
                            <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                        </button>

                        <span className="text-[16px] font-medium text-black"> 
                            {formatTime(hour)}
                        </span>

                        <button 
                        className="text-[#C1C1C1] flex items-center justify-center"
                        onClick={decreaseHour}>
                            <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                        </button>
                    </div>

                    <div className="flex flex-col w-[21px] h-[84px] items-center justify-center gap-2">
                        <p className="text-[16px] font-medium"> : </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button 
                        className="rotate-180 text-[#C1C1C1] flex items-center justify-center"
                        onClick={increaseMinute}>
                            <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                        </button>

                        <span className="text-[16px] font-medium text-black"> 
                            {formatTime(minute)} 
                        </span>

                        <button 
                        className="text-[#C1C1C1] flex items-center justify-center"
                        onClick={decreaseMinute}>
                            <ChevronDown className="" strokeWidth={5} strokeLinecap="square" strokeLinejoin="miter" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute flex w-[21px] h-[28px] mt-[140px] ml-[80px]">
                <button className="text-[12px]" onClick={onCancel}>
                    취소
                </button>
            </div>

            <div className="absolute flex w-[21px] h-[28px] mt-[140px] ml-[140px]">
                <button className="text-[12px] text-[#0EA6C0]" onClick={handleAdd}>
                    추가
                </button>
            </div>
        </div>
    )
}

export default SettingTimeModal
