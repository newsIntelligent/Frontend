import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import { updateMemberMail } from '../apis/apis';
import Header from "../components/Header";

const SettingChangePage = () => {
    const memeberId = "12345";
    
    const [name, setName] = useState("junsiyeon");
    const [isEditName, setIsEditName] = useState(false);

    const [nameChangeError, setNameChangeError] = useState<string | null>(null);
    const [isNameValid, setIsNameValid] = useState(true); 

    const [mail, setMail] = useState("junsiyeon@gmail.com");
    const [isEditMail, setIsEditMail] = useState(false);
    const [isMailValid, setIsMailValid] = useState(true); 

    useEffect(() => {
        const getMemberInfo = async () => {
            try {
                const member = await updateMemberMail(memeberId);

                console.log("API 응답 데이터:", member.email);

                setMail(member.email);
            } catch (error) {
                console.log("회원 정보 조회 실패");
            }
        };

        getMemberInfo();
    }, [memeberId]);
    
    const clickNameChange = () => {
        setIsEditName(true);
        setNameChangeError(null);
        setIsNameValid(true);
    }
    
    const InputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
    
        if (value.length > 15) {
            setNameChangeError("사용 불가능한 이름입니다.");
            setIsNameValid(false);
        } 
        
        else {
            setNameChangeError("사용 가능한 이름입니다.");
            setIsNameValid(true);
        }
    }
    
    const handleNameSave = () => {
        if (!isNameValid) return;
        setIsEditName(false);
        setNameChangeError(null);
    }
    
    const InputMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMail(value);
    }

    const clickMailChange = () => {
        setIsEditMail(true);
        setIsMailValid(true);
    }

    const handleMailSave = () => {
        if (!isMailValid) return;
        setIsEditMail(false);
    }

    return (
        <div className="h-[1031px]">
            <Header />

            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px]">
                    <div className="w-[387.54px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 설정 </div>

                        <div className="text-[18px] text-[#919191] h-[21px] font-[400px] mt-[16px]">
                            회원정보를 변경합니다.
                        </div>

                        <div className="w-[824px]">
                            <div className="flex flex-1 items-center mt-[51px] gap-[32px]">
                                <p className="w-[75px] h-[19px] text-[16px] font-semibold text-[#919191]"> 
                                    가입 이메일
                                </p>

                                <span className="w-[139px] h-[19px] text-[14px] font-[500px] text-[#919191]">
                                    junsiyeon@gmail.com
                                </span>
                            </div>

                            <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />

                            <div className="flex flex-1 items-end mt-[28px] gap-[80px]">
                                <p className="w-[28px] h-[19px] text-[16px] font-semibold text-black"> 
                                    이름
                                </p>

                                <div className="flex flex-1 w-full items-end justify-between">
                                    {isEditName ? 
                                    (
                                        <input
                                            value={name}
                                            onChange={InputNameChange}
                                            className={`w-[200px] text-[14px] font-[500] text-black focus:outline-none ${!isNameValid ? "border-red-500" : "border-gray-300"}`}
                                            autoFocus
                                        />
                                    ) 
                                    : 
                                    (
                                        <span className="h-[19px] text-[14px] font-[500px] text-black">{name}</span>
                                    )}

                                    {isEditName ? 
                                    (
                                        <button
                                            className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] font-regular text-[#0EA6C0] hover:bg-[#0EA6C026] hover:text-[#0EA6C0] disabled:bg-white disabled:cursor-not-allowed"
                                            onClick={handleNameSave}
                                            disabled={!isNameValid}
                                        >
                                            완료
                                        </button>
                                    ) 
                                    : 
                                    (
                                        <button
                                            className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] font-regular text-[#C1C1C1] hover:bg-white hover:text-[#C1C1C1]"
                                            onClick={clickNameChange}
                                        >
                                            변경
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />
                            {nameChangeError !== null ? 
                            (<p className={`w-[716px] h-[0px] ml-[106px] mt-[6px] text-[12px] font-[500px] ${isNameValid ? "text-[#0EA6C0]" : "text-[#FF3333]"}`}> {nameChangeError} </p>) 
                            : 
                            (<p className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#919191] text-[12px] font-[500px]"> 최대 15글자까지 설정 가능합니다. </p>)
                            }

                            <div className="flex flex-1 items-end mt-[42px] gap-[32px]">
                                <p className="w-[75px] h-[19px] text-[16px] font-semibold text-black"> 
                                    알림 이메일
                                </p>

                                <div className="flex flex-1 w-full items-end justify-between">
                                    {isEditMail ? 
                                    (
                                        <input
                                            value={mail}
                                            onChange={InputMailChange}
                                            className={`w-[200px] text-[14px] font-[500] text-black focus:outline-none ${!isMailValid ? "border-red-500" : "border-gray-300"}`}
                                            autoFocus
                                        />
                                    ) 
                                    : 
                                    (
                                        <span className="h-[19px] text-[14px] font-[500px] text-black"> {mail} </span>
                                    )}

                                    {isEditMail ? 
                                    (
                                        <button
                                            className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] font-regular text-[#0EA6C0] hover:bg-[#0EA6C026] hover:text-[#0EA6C0] disabled:bg-white disabled:cursor-not-allowed"
                                            onClick={handleMailSave}
                                            disabled={!isMailValid}
                                        >
                                            완료
                                        </button>
                                    ) 
                                    : 
                                    (
                                        <button
                                            className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] font-regular text-[#C1C1C1] hover:bg-white hover:text-[#C1C1C1]"
                                            onClick={clickMailChange}
                                        >
                                            변경
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />
                            <p className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#919191] text-[12px] font-[500px]"> 알림 받는 이메일을 변경합니다. </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingChangePage
