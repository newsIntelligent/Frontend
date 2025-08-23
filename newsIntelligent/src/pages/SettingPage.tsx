import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { deleteId, getMemberInfo, signout } from '../apis/apis';
import type { MemberInfo } from '../types/members';

const SettingPage = () => {
    const navigate = useNavigate();
    const [member, setMember] = useState<MemberInfo>(); 

    useEffect(() => {
        const getData = async() => {
            try {
                const response = await getMemberInfo();
    
                setMember(response.result[0]);
            } catch (error) {
                alert("로그인 후 다시 실행해 주세요.");
            }
        };

        getData();
    }, []);

    const handleSignout = async () => {
        try {

            await signout();
            localStorage.removeItem("accessToken"); //로그아웃 시 토큰 제거

            navigate("/");
        } catch (error) {
        }
    }

    const handleWithdraw = async () => {
        try {

            await deleteId();

            navigate("/");
        } catch (error) {
        }
    }

    return (
        <div className="h-[1031px]">
            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px]">
                    <div className="w-[387.54px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 설정 </div>

                        <div className="text-[18px] text-[#919191] h-[21px] font-regular mt-[16px]">
                            회원정보를 변경합니다.
                        </div>

                        <div className="flex flex-1 items-center justify-center mt-6 mb-12 w-[499px] h-[88px] border border-gray-200 rounded-md pl-[16px] pr-[16px]">
                            <img
                                src="/Logo.svg"
                                alt="프로필"
                                className="items-center w-[40px] h-[40px] rounded-full"
                            />

                            <div className='px-4 leading-5'>
                                <p className="font-bold text-[16px]"> {member?.nickname} 님</p>
                                <p className="font-light text-[14px]"> {member?.email} </p>
                            </div>

                            <button 
                            onClick={() => navigate('/settings/changes')}
                            className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] font-regular text-[#0EA6C0] hover:bg-[#0EA6C026] hover:text-[#0EA6C0]">
                                변경
                            </button>
                        </div>

                        <div className='flex flex-col gap-[28px]'>
                            <button 
                            onClick={handleSignout}
                            className='text-[14px] font-medium w-[57px] h-[17px] text-black'>
                                로그아웃
                            </button>

                            <button 
                            onClick={handleWithdraw}
                            className='text-[14px] font-medium w-[57px] h-[17px] text-[#FF3333]'>
                                회원탈퇴
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage
