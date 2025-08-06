const EmailComplete = () => {
    return (
        <div className="relative min-h-screen lg:h-[1024px] bg-white w-full flex flex-col items-center justify-center gap-4">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[#E8F6F8] pointer-events-none"/>
            <img src="EmailCheck.svg" alt="완료"
                    className="w-[100px] h-[100px] z-10"
            />
            <p className="text-[#0EA6C0] font-semibold text-2xl z-10">이메일 인증 완료</p>
            <p className="text-[#919191] mt-10 font-semibold text-sm z-10">인증페이지로 이동해주세요.</p>
        </div>
    )
}

export default EmailComplete;