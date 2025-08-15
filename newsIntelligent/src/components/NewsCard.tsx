import { useMemo, useState } from "react";
import { ChevronDown, Circle } from "lucide-react";
import SubscribeButton from "./SubscribeButton";
import { useInfiniteQuery, useQuery, useQueryClient, type QueryFunction, type QueryKey } from "@tanstack/react-query";
import { getKeywordTopic, getReadTopic, getSubscriptions } from "../apis/mypage";
import type { ContentResultResponse, ReadTopics, Subscriptions, Topics } from "../types/mypage";
import { axiosInstance } from "../api/axios";

export const readTopicsKey = (keyword?: string): QueryKey => ["readTopics", keyword ?? ""];

export function useReadTopicsInfinite(keyword?: string, size: number = 10) {
  const queryFn: QueryFunction<ReadTopics | Subscriptions, QueryKey, number> = async ({ pageParam = 0 }) => {
    if (keyword && keyword.trim()) return await getKeywordTopic(keyword.trim(), pageParam, size);
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
    staleTime: 30000,
    gcTime: 300000,
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

function useSubscriptionIds() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["subscriptionIds:all"],
    queryFn: async () => {
      const ids = new Set<number>();
      let cursor = 0;
      let hasNext = true;
      while (hasNext) {
        const page = await getSubscriptions(cursor, 50);
        const res = page.result;
        res.topics.forEach((t: { id: number }) => ids.add(t.id));
        hasNext = !!res.hasNext;
        cursor = res.cursor ?? 0;
      }
      return ids;
    },
    staleTime: 60000,
    gcTime: 300000,
    initialData: () => {
      const subInfinite = queryClient.getQueryData<{ pages: Subscriptions[] }>(["subscriptions"]);
      if (!subInfinite) return undefined;
      const ids = new Set<number>();
      subInfinite.pages.forEach((p) => p.result.topics.forEach((t) => ids.add(t.id)));
      return ids;
    },
  });
}

// 날짜 포맷 함수
const formatSummaryTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
};

const NewsCard = ({ data }: { data: Topics }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleDropdown = () => setIsExpanded((v) => !v);

    const fetchTopicRelated = async (): Promise<ContentResultResponse> => {
        const res = await axiosInstance.get(`/topic/${data.id}/related`, { params: { size: 10 } });
        return res.data as ContentResultResponse;
    };

    const {
        data: relatedData,
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        error: relatedError,
    } = useQuery({
        queryKey: ["topicRelated", data.id, isExpanded],
        queryFn: fetchTopicRelated,
        enabled: isExpanded && Number.isFinite(data.id),
        staleTime: 30000,
        gcTime: 300000,
    });

    useSubscriptionIds();

    const relatedList = useMemo(() => {
        const raw =
        (relatedData as ContentResultResponse | undefined)?.result?.content ??
        (relatedData as any)?.result?.contents ??
        [];
        const seen = new Set<string>();
        const deduped: typeof raw = [];
        for (const c of raw) {
        const key = ((c.newsLink ?? "").trim() || (c.press ?? "").trim() || `${c.id}-${c.title ?? ""}`).toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(c);
        }
        }
        deduped.sort((a: any, b: any) => (b.publishDate || "").localeCompare(a.publishDate || ""));
        return deduped.slice(0, 3);
    }, [relatedData]);

    const sourceLink = data.imageUrl;

    const SourceText = (
        <span className="underline underline-offset-2 decoration-[#919191] hover:decoration-black">
        {data.imageSource.title}
        </span>
    );

    return (
        <div className={`break-inside-avoid border border-[1px] border-[#919191] rounded-lg ${isExpanded ? "h-[597px]" : "h-[288px]"}`}>
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
                        className="text-[#919191]"
                        title={data.imageSource.title}
                    >
                        {SourceText}
                    </a>
                    ) : (
                    SourceText
                    )}
                </p>
                <SubscribeButton id={data.id} />
                </div>

                <div className="flex flex-col gap-4">
                <div className="flex">
                    <img src={data.imageUrl} alt="기사 이미지" className="w-[88px] h-[64px] object-cover rounded-[8px] mr-[12px]" />
                    <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                    {data.topicName}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="w-[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">{data.aiSummary}</div>

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

                    {!isRelatedLoading && !isRelatedError && relatedList.length === 0 && (
                    <div className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                        <span className="pl-4 text-[12px] text-[#919191]">표시할 출처 기사가 없어요.</span>
                    </div>
                    )}

                    {!isRelatedLoading &&
                    !isRelatedError &&
                    relatedList.map((c: any) => (
                        <div key={c.id} className="flex flex-col ml-5 justify-center w-[319px] h-[89px]">
                        <div className="flex flex-1 gap-2 items-center">
                            <Circle size={8} fill="#0EA6C0" className="text-[#0EA6C0]" />
                            <span className="text-[12px] font-regular text-[#919191] overflow-hidden text-ellipsis whitespace-nowrap">
                            {c.press} · {c.publishDate}
                            </span>
                        </div>
                        <a
                            href={c.newsLink}
                            target="_blank"
                            rel="noreferrer"
                            className="pl-4 w-full h-[63px] text-[14px] leading-[21px] text-black font-regular line-clamp-3 hover:underline"
                            title={c.title}
                        >
                            {c.newsSummary || c.title}
                        </a>
                        </div>
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
                        className="text-[#919191]"
                        title={data.imageSource.title}
                    >
                        {SourceText}
                    </a>
                    ) : (
                    SourceText
                    )}
                </p>
                <SubscribeButton id={data.id} />
                </div>

                <div className="flex flex-col gap-4">
                <div className="flex">
                    <img src={data.imageUrl} alt="기사 이미지" className="w-[88px] h-[64px] object-cover rounded-[8px] mr-[12px]" />
                    <div className="w-[169px] h-[59px] text-[24px] font-semibold leading-tight line-clamp-3 mb-[4px]">
                    {data.topicName}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="w-[360px] h-[98px] text-[14px] text-black leading-[24px] font-regular line-clamp-3">{data.aiSummary}</div>

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
