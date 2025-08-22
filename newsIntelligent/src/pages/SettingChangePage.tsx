import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import { getMemberInfo, getNicknameAvailability, patchNickname } from '../apis/apis';
import type { MemberInfo } from "../types/members";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const SettingChangePage = () => {  
    const navigate = useNavigate();
    const [member, setMember] = useState<MemberInfo | undefined>(undefined);

    const [name, setName] = useState("");
    const [isEditName, setIsEditName] = useState(false);
    const [nameChangeError, setNameChangeError] = useState<string | null>(null);
    const [isNameValid, setIsNameValid] = useState(true);

    const [mail, setMail] = useState("");
    const [isEditMail] = useState(false);
    const [isMailValid] = useState(true);

    useEffect(() => {
        const load = async () => {
        try {
            const response = await getMemberInfo();
            const info = Array.isArray(response.result) ? response.result[0] : response.result;
            setMember(info);
        } catch (e) {
            navigate("/login");
        }
        };
        load();
    }, [navigate]);

    useEffect(() => {
        if (!member) return;
        setName(member.nickname ?? "");
        setMail(member.email ?? "");
    }, [member]);

    const clickNameChange = () => {
        setIsEditName(true);
        setNameChangeError(null);
        setIsNameValid(true);
    };

    const InputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (value.length === 0 || value.length > 15) {
        setNameChangeError("사용 불가능한 이름입니다.");
        setIsNameValid(false);
        } else {
        setNameChangeError("사용 가능한 이름입니다.");
        setIsNameValid(true);
        }
    };

    const handleNameSave = async () => {
        if (!isNameValid) return;
        try {
        const availability = await getNicknameAvailability(name);
        if (!availability.result.available) {
            setNameChangeError("이미 사용 중인 닉네임입니다.");
            setIsNameValid(false);
            return;
        }

        await patchNickname(name);
        setMember(prev => (prev ? { ...prev, nickname: name } : prev));
        setIsEditName(false);
        setNameChangeError(null);
        } catch (error) {
        setNameChangeError("닉네임 변경에 실패하였습니다.");
        setIsNameValid(false);
        }
    };

    const InputMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMail(e.target.value);
    };

    const handleMailSave = async () => {
        if (!isMailValid) return;
        navigate("/email-change");
    };

    const handleReturnSettingPage = () => {
        navigate("/settings");
    };

    return (
        <div className="h-[1031px]">
        <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
            <Sidebar />
            <div className="absolute flex-1 ml-[208.86px]">
            <div className="w-[387.54px] leading-none justify-center">
                <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 설정 </div>
                <div className="text-[18px] text-[#919191] h-[21px] font-[400px] mt-[16px]">회원정보를 변경합니다.</div>

                <div className="w-[824px]">
                <div className="flex flex-1 items-center mt-[51px] gap-[32px]">
                    <p className="w-[75px] h-[19px] text-[16px] font-semibold text-[#919191]">가입 이메일</p>
                    <span className="w-[139px] h-[19px] text-[14px] font-[500] text-[#919191]">
                    {member?.email ?? ""}
                    </span>
                </div>

                <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />

                <div className="flex flex-1 items-end mt-[28px] gap-[65.5px]">
                    <p className="h-[19px] text-[16px] font-semibold text-black">닉네임</p>
                    <div className="flex flex-1 w-full items-end justify-between">
                    {isEditName ? (
                        <input
                        value={name}
                        onChange={InputNameChange}
                        className={`w-[200px] text-[14px] font-[500] text-black focus:outline-none ${!isNameValid ? "border-red-500" : "border-gray-300"}`}
                        autoFocus
                        />
                    ) : (
                        <span className="h-[19px] text-[14px] font-[500] text-black">{name}</span>
                    )}

                    {isEditName ? (
                        <button
                        className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] text-[#0EA6C0] hover:bg-[#0EA6C026] disabled:bg-white disabled:cursor-not-allowed"
                        onClick={handleNameSave}
                        disabled={!isNameValid}
                        >
                        완료
                        </button>
                    ) : (
                        <button
                        className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] text-[#C1C1C1]"
                        onClick={clickNameChange}
                        >
                        변경
                        </button>
                    )}
                    </div>
                </div>

                <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />
                {nameChangeError !== null ? (
                    <p className={`w-[716px] h-[0px] ml-[106px] mt-[6px] text-[12px] font-[500] ${isNameValid ? "text-[#0EA6C0]" : "text-[#FF3333]"}`}>{nameChangeError}</p>
                ) : (
                    <p className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#919191] text-[12px] font-[500]">최대 15글자까지 설정 가능합니다.</p>
                )}

                <div className="flex flex-1 items-end mt-[42px] gap-[32px]">
                    <p className="w-[75px] h-[19px] text-[16px] font-semibold text-black">알림 이메일</p>
                    <div className="flex flex-1 w-full items-end justify-between">
                    {isEditMail ? (
                        <input
                        value={mail}
                        onChange={InputMailChange}
                        className={`w-[200px] text-[14px] font-[500] text-black focus:outline-none ${!isMailValid ? "border-red-500" : "border-gray-300"}`}
                        autoFocus
                        />
                    ) : (
                        <span className="h-[19px] text-[14px] font-[500] text-black">{mail}</span>
                    )}

                    {isEditMail ? (
                        <button
                        className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] text-[#0EA6C0] hover:bg-[#0EA6C026] disabled:bg-white disabled:cursor-not-allowed"
                        onClick={handleMailSave}
                        disabled={!isMailValid}
                        >
                        완료
                        </button>
                    ) : (
                        <button
                        className="w-[64px] h-[32px] ml-auto px-4 py-2 border rounded-md text-[14px] text-[#C1C1C1]"
                        onClick={handleMailSave}
                        >
                        변경
                        </button>
                    )}
                    </div>
                </div>

                <hr className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#E6E6E6]" />
                <p className="w-[716px] h-[0px] ml-[106px] mt-[6px] text-[#919191] text-[12px] font-[500]">알림 받는 이메일을 변경합니다.</p>
                </div>
            </div>

            <button onClick={handleReturnSettingPage} className="flex flex-1 mt-[246px]">
                <ChevronDown className="rotate-90 text-[#919191]" strokeWidth={4} strokeLinecap="square" />
                <p className="pl-3 font-[500] text-[16px] text-[#919191]">이전 페이지로 돌아가기</p>
            </button>
            </div>
        </div>
        </div>
    );
};

export default SettingChangePage;
