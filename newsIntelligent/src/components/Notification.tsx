function Notification() {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-[440px] max-h-[400px] 
            bg-white rounded-[10px] border border-[#C1C1C1] z-50"
    >
      <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold  text-[#919191]">
        <span>
          새로운 알림 <span className="text-[#0B8E8E]">n</span>개
        </span>
        <div className="flex justify-between gap-6">
          <button
            className="w-20 h-6 rounded-xl border border-[#E6E6E6] items-center gap-1 hover:bg-[#E6E6E6]
                    text-xs font-semibold"
          >
            모두 읽음
          </button>
          <img src="/src/assets/vector.svg" className="w-5" />
        </div>
      </div>
    </div>
  )
}

export default Notification
