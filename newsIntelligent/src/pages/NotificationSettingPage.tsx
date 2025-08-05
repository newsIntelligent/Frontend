import { useState } from 'react';
import Sidebar from '../components/Sidebar'
import ToggleButton from '../components/ToggleButton';
import SettingTime from '../components/SettingTime';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationSettingPage = () => {
    const [nightAlarmButton, setNightAlarmButton] = useState(false);
    const [subscriptionAlarmButton, setSubscriptionAlarmButton] = useState(false);
    const [changeNotificationButton, setChangeNotification] = useState(false);
    const [dailyReport, setDailyReport] = useState(true);
    const [keywordAlarmButton, setKeywordAlarmButton] = useState(false);

    const navigate = useNavigate();

    return (
        <div className="">
            <div className="flex w-full px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 h-[114.9375px] ml-[208.86px]">
                    <div className="flex flex-col gap-[16px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium"> 알림 설정 </div>

                        <p className="text-[18px] text-[#919191] h-[21px] font-regular">
                            데일리 리포트는 <span className='text-[18px] font-regular text-[#0EA6C0]'> junsiyeon123654@gmail.com</span> 으로 전송됩니다. 
                        </p>

                        <button 
                        onClick={() => navigate('/settings/changes')}
                        className='flex flex-1 items-center justify-center w-[112px] h-[26px] pt-[4px] pr-[6px] pb-[4px] pl-[10px] rounded-sm border border-[1px] text-[#0EA6C0] hover:bg-[#0EA6C026] hover:text-[#0EA6C0]'>
                            <p className='text-[12px] font-semibold'> 이메일 변경하기 </p>
                            <ChevronDown className="w-[16px] h-[16px] rotate-270" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter"/>
                        </button>
                    </div>

                    <div className='flex flex-col gap-[26px] ml-[1.5px] mt-[36px] w-[403px] h-[412px]'>
                        <div className='w-[400px] h-[60px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] font-normal'> 야간 수신 거부 </p>                           
                                <ToggleButton isOn = {nightAlarmButton} toggle={() => setNightAlarmButton(prev => !prev)}/>
                            </div>


                            <div className='flex space-between text-[16px] font-normal mt-2'>
                                <p className='text-[#0EA6C0]'> 21:00~08:00 </p>
                                <span className='text-[#919191]'> 
                                    {nightAlarmButton ? "의 알림 수신을 수신" : "의 알림 수신을 거부"}
                                </span>
                            </div>
                        </div>

                        <div className='w-[400px] h-[60px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] font-normal'> 구독 알림 </p>                           
                                <ToggleButton isOn = {subscriptionAlarmButton} toggle={() => setSubscriptionAlarmButton(prev => !prev)}/>
                            </div>


                            <div className='flex space-between text-[16px] font-medium mt-2'>
                                <p className='text-[#0EA6C0]'> 구독 중인 토픽 </p>
                                <span className='text-[#919191]'> 
                                    {subscriptionAlarmButton ? "의 변경사항 알림 수신" : "의 변경사항 알림 거부"}
                                </span>
                            </div>
                        </div>

                        <div className='w-[400px] h-[60px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] text-[#C1C1C1] font-normal'> 읽은 토픽 변경사항 알림 </p>                           
                                <ToggleButton isOn = {changeNotificationButton} toggle={() => setChangeNotification(prev => prev)}/>
                            </div>


                            <div className='flex space-between text-[16px] font-medium mt-2'>
                                <p className='text-[#0EA6C0]'> 읽은 토픽 </p>
                                <span className='text-[#919191]'> 
                                    {changeNotificationButton ? "의 변경사항 알림 수신 " : "의 변경사항 알림    거부"}
                                </span>
                            </div>
                        </div>

                        <div className='w-[400px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] font-normal'> 데일리 리포트 </p>                           
                                <ToggleButton isOn = {dailyReport} toggle={() => setDailyReport(prev => !prev)}/>
                            </div>


                            <div className='flex space-between text-[16px] font-medium mt-2'>
                                <span className='text-[#919191]'> 
                                {dailyReport ?
                                    <div> 지정된 시간에 알림 목록을 종합해서 수신
                                        <div className='flex flex-1 w-[400px] mt-4'>
                                            <SettingTime />
                                        </div>
                                    </div>
                                    : "지정된 시간에 알림 목록을 종합해서 거부"}
                                </span>
                            </div>
                        </div>

                        <div className='w-[400px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] text-[#C1C1C1] font-normal'> 키워드 알림 설정 </p>                           
                                <ToggleButton isOn = {keywordAlarmButton} toggle={() => setKeywordAlarmButton(prev => prev)}/>
                            </div>


                            <div className='flex space-between text-[16px] font-medium mt-2'>
                                <p className='text-[#0EA6C0]'> 등록한 키워드 </p>
                                <span className='text-[#919191]'> 
                                    {keywordAlarmButton ? "에 대한 알림을 수신" : "에 대한 알림을 거부"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default NotificationSettingPage
