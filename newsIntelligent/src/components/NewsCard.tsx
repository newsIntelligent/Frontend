import { useMemo, useState } from "react";
import { ChevronDown, Circle } from "lucide-react";
import SubscribeButton from "./SubscribeButton";
import { useQuery } from "@tanstack/react-query";
import type { ContentResultResponse, Topics } from "../types/mypage";
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

const formatSummaryTime = (isoString: string) => {
    if (!isoString) return "";

    const d = new Date(isoString);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    
    return `${mm}/${dd} ${hh}:${mi}`;
};

type TopicWithSub = Topics & { isSub?: boolean; imageSource?: { press?: string; title?: string } };

const getImageSourceLink = (related: any[], data: TopicWithSub): string | null => {
    const title = data.imageSource?.title?.trim()?.toLowerCase() ?? "";
    const press = data.imageSource?.press?.trim()?.toLowerCase() ?? "";
    const img = data.imageUrl?.trim() ?? "";

    const byTitle = related.find((c: any) => (c?.title ?? "").trim().toLowerCase() === title)?.newsLink;
    if (byTitle) return byTitle;

    const byPress = related.find((c: any) => (c?.press ?? "").trim().toLowerCase() === press)?.newsLink;
    if (byPress) return byPress;

    const byImageUrl = related.find((c: any) => (c as any)?.imageUrl && (c as any).imageUrl === img)?.newsLink;
    if (byImageUrl) return byImageUrl;

    return null;
};

const NewsCard = ({ data, sub }: { data: TopicWithSub; sub?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const subscribed = sub ?? !!data.isSub;

    const fetchTopicRelated = async (): Promise<ContentResultResponse> => {
        const res = await axiosInstance.get(`/topic/${data.id}/related`, { params: { size: 10 } });
        return res.data as ContentResultResponse;
    };

    const { data: relatedData, isLoading, isError, error } = useQuery({
        queryKey: ["topicRelated", data.id],
        queryFn: fetchTopicRelated,
        enabled: Number.isFinite(data.id),
        staleTime: 30000,
        gcTime: 300000,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const relatedList = useMemo(() => {
        const raw = relatedData?.result?.content ?? [];
        const seen = new Set<string>();
        const out: typeof raw = [];
        for (const c of raw) {
        const key = ((c.newsLink ?? "").trim() || (c.press ?? "").trim() || `${c.id}-${c.title ?? ""}`).toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            out.push(c);
        }
        }
        out.sort((a: any, b: any) => (b.publishDate || "").localeCompare(a.publishDate || ""));
        return out;
    }, [relatedData]);

    const handleCardClick = () => navigate(`/article?id=${data.id}`);

    const sourceLink = getImageSourceLink(relatedList, data);
    const sourceTitle = data.imageSource?.title ?? "";

    return (
        <div
        className={`break-inside-avoid border border-[1px] border-[#919191] rounded-lg ${isExpanded ? "h-[597px]" : "h-[288px]"} cursor-pointer`}
        onClick={handleCardClick}
        >
        {isExpanded ? (
            <div className="w-[410px] h-[595px]">
            <div className="flex flex-col p-6 gap-4">
                <div className="flex flex-1 justify-between items-center">
                <p className="w-[298px] h-[21px] text-[12px] font-normal text-[#919191] overflow-hidden whitespace-nowrap truncate">
                    업데이트 {formatSummaryTime(data.summaryTime)} ·{" "}
                    {sourceLink ? (
                    <a
                        href={sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#919191] underline underline-offset-2 decoration-[#919191] hover:decoration-black"
                        title={sourceTitle}
                    >
                        {sourceTitle}
                    </a>
                    ) : (
                    <span className="underline underline-offset-2 decoration-[#919191]">{sourceTitle}</span>
                    )}
                </p>
                <div onClick={(e) => e.stopPropagation()}>
                    <SubscribeButton id={data.id} subscribe={subscribed} />
                </div>
                </div>

                <div className="flex flex-col gap-4">
                <div className="flex">
                    <img src={data.imageUrl} alt="" className="w-[88px] h-[64px] object-cover rounded-[8px] mr-[12px]" />
                    <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                    {data.topicName}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="w-[360px] h-[98px] text-[14px] leading-[24px] line-clamp-3">{data.aiSummary}</div>

                    <div className="mt-[8px] flex items-center justify-between">
                    <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded((v) => !v);
                        }}
                        className="flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200"
                    >
                        <span>{isExpanded ? "접기" : "출처 기사 펼치기"}</span>
                        <ChevronDown size={16} className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {isLoading && (
                    <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                        <span className="pl-4 text-[12px] text-[#919191]">출처 기사를 불러오는 중...</span>
                    </div>
                    )}

                    {isError && (
                    <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                        <span className="pl-4 text-[12px] text-red-500">
                        출처 기사 로딩 실패{error instanceof Error ? `: ${error.message}` : ""}
                        </span>
                    </div>
                    )}

                    {!isLoading &&
                    !isError &&
                    (relatedList.length === 0 ? (
                        <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                        <span className="pl-4 text-[12px] text-[#919191]">표시할 출처 기사가 없어요.</span>
                        </div>
                    ) : (
                        relatedList.map((c: any) => (
                        <div key={c.id} className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                            <div className="flex flex-1 gap-2 items-center">
                            <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                            <span className="text-[12px] text-[#919191] overflow-hidden text-ellipsis whitespace-nowrap">
                                {c.press} · {c.publishDate}
                            </span>
                            </div>
                            <a
                            href={c.newsLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pl-4 w-full h-[63px] text-[14px] leading-[21px] line-clamp-3 hover:underline"
                            title={c.title}
                            >
                            {c.newsSummary || c.title}
                            </a>
                        </div>
                        ))
                    ))}
                </div>
                </div>
            </div>
            </div>
        ) : (
            <div className="w-[410px]">
            <div className="flex flex-col m-6 gap-4">
                <div className="flex flex-1 justify-between items-center">
                <p className="w-[298px] h-[21px] text-[12px] font-normal text-[#919191] overflow-hidden whitespace-nowrap truncate">
                    업데이트 {formatSummaryTime(data.summaryTime)} ·{" "}
                    {sourceLink ? (
                    <a
                        href={sourceLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#919191] underline underline-offset-2 decoration-[#919191] hover:decoration-black"
                        title={sourceTitle}
                    >
                        {sourceTitle}
                    </a>
                    ) : (
                    <span className="underline underline-offset-2 decoration-[#919191]">{sourceTitle}</span>
                    )}
                </p>
                <div onClick={(e) => e.stopPropagation()}>
                    <SubscribeButton id={data.id} subscribe={subscribed} />
                </div>
                </div>

                <div className="flex flex-col gap-4">
                <div className="flex">
                    <img src={data.imageUrl} alt="" className="w-[88px] h-[64px] object-cover rounded-[8px] mr-[12px]" />
                    <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                    {data.topicName}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="w-[360px] h-[98px] text-[14px] leading-[24px] line-clamp-3">{data.aiSummary}</div>

                    <div className="mt-[8px] flex items-center justify-between">
                    <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded((v) => !v);
                        }}
                        className="flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200"
                    >
                        <span>{isExpanded ? "접기" : "출처 기사 펼치기"}</span>
                        <ChevronDown size={16} className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default NewsCard;

