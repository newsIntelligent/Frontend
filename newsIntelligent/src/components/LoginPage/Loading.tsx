const Loading = ({ error }: { error?: boolean }) => {
  return (
    <div className="w-[499px]">
      {/* 로딩 아이콘과 메시지 */}
      {!error && (
        <div className="flex flex-col items-center gap-8">
          <div className="relative animate-spin w-20 h-20">
            <div className="w-full h-full rounded-full "
                  style={{
                    display: "block",
                    background: "conic-gradient(#0EA6C0 15%, #0EA6C080 50%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(closest-side, transparent 60%, white 62%)",
                    maskImage: "radial-gradient(closest-side, transparent 60%, white 62%)"
                  }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0EA6C0]" />
          </div>
          <p className="text-[#0EA6C0] font-semibold text-md">코드 확인 중...</p>
        </div>
      )}

      {/* 오류 아이콘과 메시지 */}
      {error && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <img src="Error.svg" alt="오류아이콘" className="w-[36px] h-[36px]" />
          <p className="text-[#FF3333] font-semibold text-md">
            입력한 코드가 유효하지 않습니다. 다시 시도해보세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default Loading;
