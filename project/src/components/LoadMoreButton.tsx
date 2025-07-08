function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="w-[841px] h-[36px] border border-[#C1C1C1] text-center text-[14px] "
        onClick={onClick}>
            토픽 더 보기
    </button>
  );
}

export default LoadMoreButton;