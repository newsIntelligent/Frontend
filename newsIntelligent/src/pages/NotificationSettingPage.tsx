import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'
import ToggleButton from '../components/ToggleButton';
import SettingTime from '../components/SettingTime';
import { ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { patchSetSubscribeNotification, patchSetReadTopicNotification, patchSetDailyReport, getSetting } from '../apis/members';
import { getMemberInfo } from '../apis/apis';
import type { MemberInfo, MemberSettingResponse } from '../types/members';

const NotificationSettingPage = () => {
    const [nightAlarmButton, setNightAlarmButton] = useState(false);
    const [subscriptionAlarmButton, setSubscriptionAlarmButton] = useState(false);
    const [changeNotificationButton, setChangeNotification] = useState(false);
    const [dailyReport, setDailyReport] = useState(true);
    const [keywordAlarmButton, setKeywordAlarmButton] = useState(false);
    
    const [member, setMember] = useState<MemberInfo>(); 

    const navigate = useNavigate();
    const location = useLocation();

    const getData = async() => {
        try {
            console.log("🔍 getData 호출됨 - 현재 URL:", window.location.href);
            const response = await getMemberInfo();
            console.log("🔍 getMemberInfo 응답:", response);
            console.log("🔍 설정할 member 데이터:", response.result[0]);

            setMember(response.result[0]);
        } catch (error) {
            console.log("데이터를 받아오지 못했습니다.", error);
            alert("로그인 후 다시 실행해 주세요.");

            navigate("/login");
        }
    };

    useEffect(() => {
        console.log("🔄 useEffect 트리거됨 - location 변경:", location);
        getData();
    }, [location]); // location 객체 전체가 변경될 때마다 데이터 새로고침

    // 페이지가 포커스될 때마다 데이터 새로고침 (이메일 변경 완료 후 돌아올 때)
    useEffect(() => {
        const handleFocus = () => {
            console.log("페이지 포커스됨 - 데이터 새로고침");
            getData();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                console.log("페이지 가시성 변경됨 - 데이터 새로고침");
                getData();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleSubscriptionToggle = async () => {
        const newValue = !subscriptionAlarmButton;

        console.log(`[DEBUG] 구독 알림 토글 클릭됨. newValue:`, newValue);

        setSubscriptionAlarmButton(newValue); 

        try {
            await patchSetSubscribeNotification(newValue);
        } 
        
        catch (error) {
            console.error("구독 알림 설정 실패:", error);
            setSubscriptionAlarmButton(prev => !prev); 
        }
    };

    const handleChangeNotificationToggle = async () => {
        const newValue = !changeNotificationButton;

        console.log(`[DEBUG] 읽은 토픽 알림 토글 클릭됨. newValue:`, newValue);

        setChangeNotification(newValue);

        try {
            await patchSetReadTopicNotification(newValue);
        } 
        
        catch (error) {
            console.error("읽은 토픽 알림 설정 실패:", error);
            setChangeNotification(prev => !prev);
        }
    };

    const handleDailyReportToggle = async () => {
        const newValue = !dailyReport;

        console.log(`[DEBUG] 데일리 리포트 토글 클릭됨. newValue:`, newValue);

        setDailyReport(newValue);

        try {
            await patchSetDailyReport(newValue);
        } 
        
        catch (error) {
            console.error("데일리 리포트 설정 실패:", error);
            setDailyReport(prev => !prev);
        }
    };

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setErrorMsg(null);
            
            try {
                const response : MemberSettingResponse = await getSetting();
                const { subscribeNotification, readTopicNotification, dailyReportSend } = response.result;
        
                if (!cancelled) {
                    setSubscriptionAlarmButton(!!subscribeNotification);
                    setChangeNotification(!!readTopicNotification);
                    setDailyReport(!!dailyReportSend);
                }

            } catch (error) {
                if (!cancelled) {
                    setErrorMsg('설정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');

                    console.log(loading, errorMsg);
                };

                console.error('[SETTING] fetch failed:', error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
    )();

    return () => { cancelled = true; };
}, []);

    return (
        <div className="">
            <div className="flex w-full px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 h-dvh ml-[208.86px]">
                    <div className="flex flex-col gap-[16px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium"> 알림 설정 </div>
                                                 <p className="text-[18px] text-[#919191] h-[21px] font-regular">
                             데일리 리포트는 <span className='text-[18px] font-regular text-[#0EA6C0]'> {member?.notificationEmail || member?.email}</span> 으로 전송됩니다. 
                         </p>
                        <button 
                            onClick={() => navigate('/settings/changes')}
                            className='flex flex-1 items-center justify-center w-[112px] h-[26px] pt-[4px] pr-[6px] pb-[4px] pl-[10px] rounded-sm border border-[1px] text-[#0EA6C0] hover:bg-[#0EA6C026] hover:text-[#0EA6C0]'>
                            <p className='text-[12px] font-semibold'> 이메일 변경하기 </p>
                            <ChevronDown className="w-[16px] h-[16px] rotate-270" strokeWidth={2}/>
                        </button>
                    </div>

                    <div className='flex flex-col gap-[26px] ml-[1.5px] mt-[36px] w-[403px] h-[412px]'>
                        <div className='w-[400px] h-[60px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] text-[#C1C1C1] font-normal'> 야간 수신 거부 </p>                           
                                <ToggleButton isOn={nightAlarmButton} toggle={() => setNightAlarmButton(prev => !prev)}/>
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
                                <ToggleButton isOn={subscriptionAlarmButton} toggle={handleSubscriptionToggle}/>
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
                                <p className='text-[20px] font-normal'> 읽은 토픽 변경사항 알림 </p>                           
                                <ToggleButton isOn={changeNotificationButton} toggle={handleChangeNotificationToggle}/>
                            </div>
                            <div className='flex space-between text-[16px] font-medium mt-2'>
                                <p className='text-[#0EA6C0]'> 읽은 토픽 </p>
                                <span className='text-[#919191]'> 
                                    {changeNotificationButton ? "의 변경사항 알림 수신 " : "의 변경사항 알림 거부"}
                                </span>
                            </div>
                        </div>

                        <div className='w-[400px]'>
                            <div className='flex justify-between items-center h-[28px]'>
                                <p className='text-[20px] font-normal'> 데일리 리포트 </p>                           
                                <ToggleButton isOn={dailyReport} toggle={handleDailyReportToggle}/>
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
                                <ToggleButton isOn={keywordAlarmButton} toggle={() => setKeywordAlarmButton(prev => !prev)}/>
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

export default NotificationSettingPage;
