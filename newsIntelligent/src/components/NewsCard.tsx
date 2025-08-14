import { useEffect, useMemo, useState } from "react";
import SubscribeButton from "./SubscriptionButton";
import { ChevronDown, Circle } from "lucide-react";
import { getKeywordTopic, getReadTopic, getSubscriptions, getTopicRelated } from "../apis/mypage";
import { useInfiniteQuery, useQuery, type QueryFunction, type QueryKey } from "@tanstack/react-query";
import type { ContentResultResponse, ReadTopics, Subscriptions, Topics } from "../types/mypage";

export const readTopicsKey = (keyword?: string): QueryKey => ["readTopics", keyword ?? ""];

export function useReadTopicsInfinite(keyword?: string, size: number = 10) {
    const queryFn: QueryFunction<ReadTopics | Subscriptions, QueryKey, number> = async ({ pageParam = 0 }) => {
        if (keyword && keyword.trim()) {
            return await getKeywordTopic(keyword.trim(), pageParam, size);
        }

        return await getReadTopic(pageParam, size);
    };

    const query = useInfiniteQuery({
        queryKey: readTopicsKey(keyword),
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const res = (lastPage as ReadTopics | Subscriptions).result;

            return res?.hasNext ? res.cursor : undefined;
        },

        staleTime: 30_000,
        gcTime: 300_000,
    });

    const topics: Topics[] = useMemo(() => {
        const pages = query.data?.pages ?? [];
        const acc: Topics[] = [];
        const seen = new Set<number>();

        for (const p of pages) {
            const list = (p as ReadTopics | Subscriptions).result?.topics ?? [];

            for (const t of list) {
                if (!seen.has(t.id)) {
                seen.add(t.id);
                acc.push(t);
                }
            }
        }

        return acc;
    }, [query.data]);

    return { ...query, topics };
}

export function NewsCardDataProvider({
    keyword,
    size = 10,
    children,
}: {
    keyword?: string;
    size?: number;
    children: (p: {
        topics: Topics[];
        fetchNextPage: () => void;
        hasNextPage?: boolean;
        isFetching: boolean;
        isFetchingNextPage: boolean;
        isLoading: boolean;
        isError: boolean;
        error: unknown;
    }) => React.ReactNode;
}) {
    const {
        topics,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useReadTopicsInfinite(keyword, size);

    useEffect(() => {
    }, [topics.length]);

    return (
        <>
            {children({
                topics,
                fetchNextPage,
                hasNextPage,
                isFetching,
                isFetchingNextPage,
                isLoading,
                isError,
                error,
            })}
        </>
    );
}

// NewsCard.tsx에 추가
export function useSubscriptionsInfinite(size: number = 10) {
    const queryFn: QueryFunction<Subscriptions, QueryKey, number> = async ({ pageParam = 0 }) => {
        return await getSubscriptions(pageParam, size);
    };
    
    const query = useInfiniteQuery({
        queryKey: ["subscriptions"],
        queryFn,
        initialPageParam: 0,
        
        getNextPageParam: (lastPage) => {
            const res = lastPage.result;
            return res?.hasNext ? res.cursor : undefined;
        },
    });
    
        const topics = useMemo(() => {
        const pages = query.data?.pages ?? [];
        const all: Topics[] = [];
        const seen = new Set<number>();

        pages.forEach((p) => {
            p.result.topics.forEach((t) => {
                if (!seen.has(t.id)) {
                    seen.add(t.id);
                    all.push(t);
                }
            });
        });

            return all;
        }, [query.data]);
    
        return { ...query, topics };
}

export function SubscriptionsDataProvider({
        size = 10,
        children,
    }: {
        size?: number;
        children: (p: ReturnType<typeof useSubscriptionsInfinite>) => React.ReactNode;
    }) {
    const hook = useSubscriptionsInfinite(size);

    return <>{children(hook)}</>;
}

const NewsCard = ({ data: _data }: { data: Topics }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDropdown = () => setIsExpanded((v) => !v);

    const {
        data: relatedData,
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        error: relatedError,
    } = useQuery<ContentResultResponse>({
        queryKey: ["topicRelated", _data.id],
        queryFn: () => getTopicRelated(_data.id, 0, 3),
        enabled: isExpanded, // 펼쳤을 때만 요청
        staleTime: 30_000,
        gcTime: 300_000,
    });

    const relatedList = useMemo(() => {
        return relatedData?.result?.content ?? [];
    }, [relatedData]);

    return (
        <div className={`break-inside-avoid border border-[1px] border-[#919191] rounded-lg ${isExpanded ? "h-[597px]" : "h-[288px]"}`}>
        {isExpanded ? (
            <div className="w-[410px] h-[595px]">
                <div className="flex flex-col p-6 gap-4">
                    <div className="flex flex-1 justify-between">
                        <p className="text-[12px] font-[400px] text-[#919191]">
                            업데이트 {_data.summaryTime} · 이미지 출처
                        </p>
                        <SubscribeButton />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex">
                            <img
                            src={_data.imageUrl}
                            alt="기사 이미지"
                            className="w-[88px] h-[964x] object-cover rounded-[8px] mr-[12px]"
                            />

                            <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                            {_data.topicName}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="w/[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">
                            {_data.aiSummary}
                            </div>

                            <div className="mt-[8px] flex items-center justify-between">
                                <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                                <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200`}
                                >
                                    <span>{isExpanded ? "접기" : "출처 기사 펼치기"}</span>
                                    <ChevronDown size={16} className={`ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            {[0, 1, 2].map((i) => (
                            <div key={i} className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                <div className="flex flex-1 gap-2 items-center">
                                <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                                <span className="text-[12px] font-regular text-[#919191]">연합신문 · {_data.summaryTime}</span>
                                </div>
                                <span className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3">
                                {_data.aiSummary}
                                </span>
                            </div>
                            ))}

                            {isRelatedLoading && (
                                <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <span className="pl-4 text-[12px] text-[#919191]">출처 기사를 불러오는 중...</span>
                                </div>
                            )}

                            {isRelatedError && (
                                <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <span className="pl-4 text-[12px] text-red-500">
                                        출처 기사 로딩 실패{relatedError instanceof Error ? `: ${relatedError.message}` : ""}
                                    </span>
                                </div>
                            )}

                            {!isRelatedLoading && !isRelatedError && relatedList.map((c) => (
                                <div key={c.id} className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                                    <div className="flex flex-1 gap-2 items-center">
                                        <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                                        <span className="text-[12px] font-regular text-[#919191]">
                                        {c.press} · {c.publishDate}
                                        </span>
                                    </div>

                                    <span className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3">
                                        {c.newsSummary}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="w-[410px]">
                <div className="flex flex-col m-6 gap-4">
                    <div className="flex flex-1 justify-between">
                        <p className="text-[12px] font-[400px] text-[#919191]">업데이트 {_data.summaryTime} · 이미지 연합뉴스</p>
                        <SubscribeButton />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex">
                            <img
                            src={_data.imageUrl}
                            alt="기사 이미지"
                            className="w-[88px] h-[964x] object-cover rounded-[8px] mr-[12px]"
                            />

                            <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                            {_data.topicName}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="w-[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">
                            {_data.aiSummary}
                            </div>

                            <div className="mt-[8px] flex items-center justify-between">
                                <hr className={`border-t border-gray-300 ${isExpanded ? "w-[307px]" : "w-[259px]"}`} />
                                <button
                                    onClick={toggleDropdown}
                                    className={`flex items-center text-[10px] text-[#919191] hover:text-black rounded-md transition-colors duration-200`}
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
