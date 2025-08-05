import { useCallback, useEffect, useRef, useState } from "react"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"
import NewsCardSkeleton from "../components/NewsCardSkeleton"
import type { NewsItems } from "../types/subscriptions"
import Header from "../components/Header"
import { getReadNews } from "../apis/apis"

const MyPage = () => {
    const [newsList, setNewsList] = useState<NewsItems[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [more, setMore] = useState(true);
    const loaderReference = useRef(null);

    const [isLoading, setIsLoading] = useState(false);

    const getNews = useCallback(async() => {
        if(!more) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await getReadNews(cursor, 10);

            console.log("🔍 API 응답:", response);

            setNewsList(prev => [...prev, ...response.result]);
            setCursor(response.nextCursor ?? null);
            setMore(response.hasNext);
        } catch(e) {
            console.error("뉴스 로딩 실패", e);
        } finally {
            setIsLoading(false);
        }
    }, [cursor, more]);

    useEffect(() => {
        getNews();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && more) {
                getNews();
            }
        }, {threshold : 1});

        if(loaderReference.current) {
            observer.observe(loaderReference.current);
        }

        return() => {
            if(loaderReference.current) {
                observer.unobserve(loaderReference.current);
            }
        }
    }, [getNews, more]);
    
    return (
        <div className="h-[1031px]">
            <Header />

            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px]">
                    <div className="w-[541px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 주제 구독 </div>

                        <div className="text-[18px] text-[#919191] w-full h-[21px] font-regular mt-[16px]">
                            News intelligent는 최대 20개의 주제별 구독을 제공합니다. 
                        </div>
                    </div>

                    <div className="flex mt-[36px] mb-[16px] w-[840px]">
                        <p className="font-medium text-[16px]"> 현재 <span className="text-[#0B8E8E]"> 11개의 주제</span>를 구독 중입니다. </p>
                    </div>

                    <div className="columns-2 [column-gap:1.3rem] space-y-5">
                        {newsList.map((item, idx) => (
                            <NewsCard key={idx} data={item} />
                        ))}

                        {isLoading && (
                            <>
                            <NewsCardSkeleton />
                            <NewsCardSkeleton />
                            </>
                        )}

                        <div ref={loaderReference} className="h-10" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage
