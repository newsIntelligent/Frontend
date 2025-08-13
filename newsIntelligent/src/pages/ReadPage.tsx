// ReadPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import MyPageSearchBar from '../components/MyPageSearchBar';
import NewsCard from '../components/NewsCard';
import Sidebar from "../components/Sidebar"
import NewsCardSkeleton from "../components/NewsCardSkeleton";
import { getKeywordTopic, getReadTopic } from "../apis/mypage";
import type { Topics } from "../types/mypage";

const ReadPage = () => {
    const [newsList, setNewsList] = useState<Topics[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [more, setMore] = useState(true);
    const loaderReference = useRef<HTMLDivElement | null>(null);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const cursorRef = useRef<number | null>(null);
    const moreRef = useRef<boolean>(true);
    const isLoadingRef = useRef<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => { cursorRef.current = cursor; }, [cursor]);
    useEffect(() => { moreRef.current = more; }, [more]);
    useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

    const getNews = useCallback(async () => {
        if (!moreRef.current || isLoadingRef.current) { 
            return; 
        }

        setIsLoading(true);

        try {
            const response = await getReadTopic(cursorRef.current ?? 0);
            const newTopics = response?.result?.topics ?? [];

            if (newTopics.length === 0) {
                setMore(false);

                moreRef.current = false;
                observerRef.current?.disconnect();

                return;
            }

            setNewsList(prev => {
                try {
                    const existingIds = new Set(prev.map(p => (p as any).id));
                    const filtered = newTopics.filter((nt: any) => !(existingIds.has((nt as any).id)));

                    return [...prev, ...filtered];
                } 
                
                catch {
                    return [...prev, ...newTopics];
                }
            });

            const nextCursor = response.result.cursor ?? null;
            const hasNext = !!response.result.hasNext;

            setCursor(nextCursor);
            cursorRef.current = nextCursor;

            setMore(hasNext);
            moreRef.current = hasNext;

            if (!hasNext) {
                observerRef.current?.disconnect();
            }

        } catch (e: any) {
            console.error("뉴스 로딩 실패", e);
            console.error("📛 상태 코드:", e?.response?.status);
            console.error("📛 에러 응답 본문:", e?.response?.data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getNews();
    }, [getNews]);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                getNews();
            }
        }, { threshold: 0.5 });

        observerRef.current = obs;
        const el = loaderReference.current;

        if (el) obs.observe(el);

        return () => {
            obs.disconnect();
            observerRef.current = null;
        };
    }, [getNews]);

    const filter = useMemo(() => {
        if (searchKeyword.trim() === "") {
            return newsList;
        }

        const lowerKeyword = searchKeyword.toLowerCase();

        return newsList.filter(news =>
            news.topicName.toLowerCase().includes(lowerKeyword) ||
            news.aiSummary.toLowerCase().includes(lowerKeyword)
        );
    }, [searchKeyword, newsList]);

    const handleSearch = async (keyword: string) => {
        setSearchKeyword(keyword);
        setIsLoading(true);
        setMore(true);
        setCursor(null);
        cursorRef.current = null;
        moreRef.current = true;
    
        try {
            const response = await getKeywordTopic(keyword, 0);
            const topics = response?.result?.topics ?? [];
    
            setNewsList(topics);
            setCursor(response.result.cursor ?? null);
            cursorRef.current = response.result.cursor ?? null;
            setMore(response.result.hasNext);
            moreRef.current = response.result.hasNext;
        } catch (error) {
            console.error("검색 결과 로딩 실패", error);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="h-[1031px]">
            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px]">
                    <div className="w-[387.54px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 읽은 토픽 </div>

                        <p className="text-[18px] text-[#919191] h-[21px] font-regular mt-[16px]">
                            <span> 전시연</span> 님이 읽은 기사예요.
                        </p>
                    </div>

                    <div className="flex mt-[24px] mb-[24px] w-[840px] justify-between">
                        <MyPageSearchBar onSearch={handleSearch} />
                    </div>

                    <div className="columns-2 [column-gap:1.3rem] space-y-5">
                        {filter.map((item, idx) => (
                            <NewsCard key={(item as any).id ?? `${(item as any).topicName ?? idx}-${idx}`} data={item} />
                        ))}

                        {isLoading && (
                            <>
                                <NewsCardSkeleton />
                                <NewsCardSkeleton />
                            </>
                        )}

                        {more && <div ref={loaderReference} className="h-10" />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReadPage
