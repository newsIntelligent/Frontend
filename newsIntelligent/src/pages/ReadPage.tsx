import { useCallback, useEffect, useRef, useState } from "react"
import MyPageSearchBar from '../components/MyPageSearchBar';
import NewsCard from '../components/NewsCard';
import Sidebar from "../components/Sidebar"
import NewsCardSkeleton from "../components/NewsCardSkeleton";
import { getReadTopic } from "../apis/mypage";
import Header from "../components/Header";
import type { NewsItems } from "../types/subscriptions";
import { getReadNews } from "../apis/apis";

const ReadPage = () => {
    const [newsList, setNewsList] = useState<NewsItems[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [more, setMore] = useState(true);
    const loaderReference = useRef(null);

    const [allNews, setAllNews] = useState<NewsItems[]>([]);
    const [filter, setFilter] = useState<NewsItems[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");

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

    useEffect(() => {
        const lowerKeyword = searchKeyword.toLowerCase();
        const result = allNews.filter(news => 
            news.topicName.toLowerCase().includes(lowerKeyword) ||
            news.aiSummary.toLowerCase().includes(lowerKeyword)
        );

        setFilter(result);
    }, [searchKeyword, allNews])

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
