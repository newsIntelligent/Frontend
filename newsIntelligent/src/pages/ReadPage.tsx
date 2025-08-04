import { useCallback, useEffect, useRef, useState } from "react"
import MyPageSearchBar from '../components/MyPageSearchBar';
import NewsCard from '../components/NewsCard';
import Sidebar from "../components/Sidebar"
import NewsCardSkeleton from "../components/NewsCardSkeleton";
import { getReadTopic } from "../apis/mypage";
import Header from "../components/Header";
import type { NewsItems } from "../types/subscriptions";

const ReadPage = () => {
    const [newsList, setNewsList] = useState<NewsItems[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [more, setMore] = useState(true);
    const loaderReference = useRef(null);

    //const [allNews, setAllNews] = useState<NewsItems[]>([]);
    //const [filter, setFilter] = useState<NewsItems[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const getNews = useCallback(async () => {
        if (!more) return;
    
        setIsLoading(true);
    
        try {
            const response = await getReadTopic(cursor ?? 0);
            const newTopics = response?.result?.topics ?? [];

            console.log("📦 응답 데이터:", response);
    
            setNewsList(prev => [...prev, ...newTopics]);
            setCursor(response.result.cursor ?? null);
            setMore(response.result.hasNext);
        } catch (e: any) {
            console.error("뉴스 로딩 실패", e);
            console.error("📛 상태 코드:", e.response?.status);
            console.error("📛 에러 응답 본문:", e.response?.data);  // << 이거 추가!
        }
        finally {
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

    /*
    useEffect(() => {
        const lowerKeyword = searchKeyword.toLowerCase();
        const result = newsList.filter(news => 
            news.topicName.toLowerCase().includes(lowerKeyword) ||
            news.aiSummary.toLowerCase().includes(lowerKeyword)
        );

        setFilter(result);
    }, [searchKeyword, newsList])
    */

    return (
        <div className="h-[1031px]">
            <Header />

            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px] mt-[179px]">
                    <div className="w-[387.54px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 읽은 토픽 </div>

                        <p className="text-[18px] text-[#919191] h-[21px] font-regular mt-[16px]">
                            <span> 전시연</span> 님이 읽은 기사예요.
                        </p>
                    </div>

                    <div className="flex mt-[24px] mb-[24px] w-[840px] justify-between">
                        <MyPageSearchBar onSearch={setSearchKeyword}/>
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

export default ReadPage
