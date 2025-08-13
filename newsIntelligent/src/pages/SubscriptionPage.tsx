<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from 'react'
import NewsCard from '../components/NewsCard'
import Sidebar from '../components/Sidebar'
import NewsCardSkeleton from '../components/NewsCardSkeleton'
import type { NewsItems } from '../types/subscriptions'
import { getReadNews } from '../apis/apis'

const MyPage = () => {
  const [newsList, setNewsList] = useState<NewsItems[]>([])
  const [cursor, setCursor] = useState<number | null>(null)
  const [more, setMore] = useState(true)
  const loaderReference = useRef(null)

  const [isLoading, setIsLoading] = useState(false)

  const getNews = useCallback(async () => {
    if (!more) {
      return
    }

    setIsLoading(true)

    try {
      const response = await getReadNews(cursor, 10)

      console.log('🔍 API 응답:', response)

      setNewsList((prev) => [...prev, ...response.result])
      setCursor(response.nextCursor ?? null)
      setMore(response.hasNext)
    } catch (e) {
      console.error('뉴스 로딩 실패', e)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, more])

  useEffect(() => {
    getNews()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && more) {
          getNews()
        }
      },
      { threshold: 1 }
=======
// SubscriptionPage.tsx
import { useCallback, useEffect, useRef, useState } from "react"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"
import NewsCardSkeleton from "../components/NewsCardSkeleton"
import { getSubscriptions } from "../apis/mypage" 
import type { Topics } from "../types/mypage"

const SubscriptionPage = () => {
    const [newsList, setNewsList] = useState<Topics[]>([]);
    const [cursor, setCursor] = useState<number | null>(null);
    const [more, setMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loaderReference = useRef<HTMLDivElement | null>(null);
    const cursorRef = useRef<number | null>(null);
    const moreRef = useRef<boolean>(true);
    const isLoadingRef = useRef<boolean>(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => { cursorRef.current = cursor; }, [cursor]);
    useEffect(() => { moreRef.current = more; }, [more]);
    useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

    const getNews = useCallback(async () => {
        if (!moreRef.current || isLoadingRef.current) return;

        setIsLoading(true);
        try {
            const response = await getSubscriptions(cursorRef.current ?? 0, 10);
            const newTopics = response?.result?.topics ?? [];

            if (newTopics.length === 0) {
                setMore(false);
                moreRef.current = false;
                observerRef.current?.disconnect();
                return;
            }

            setNewsList(prev => {
                const existingIds = new Set(prev.map(p => (p as any).id));
                const filtered = newTopics.filter((nt: any) => !existingIds.has((nt as any).id));
                return [...prev, ...filtered];
            });

            const nextCursor = response.result.cursor ?? null;
            const hasNext = !!response.result.hasNext;
            setCursor(nextCursor);
            cursorRef.current = nextCursor;
            setMore(hasNext);
            moreRef.current = hasNext;

            if (!hasNext) observerRef.current?.disconnect();
        } catch (e) {
            console.error("구독 뉴스 로딩 실패", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { getNews(); }, [getNews]);

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) getNews();
        }, { threshold: 0.5 });

        observerRef.current = obs;
        const el = loaderReference.current;
        if (el) obs.observe(el);

        return () => {
            obs.disconnect();
            observerRef.current = null;
        };
    }, [getNews]);

    return (
        <div className="h-[1031px]">
            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px]">
                    <div className="w-[541px] leading-none justify-center">
                        <div className="text-[32px] font-medium mt-[1.5px]"> 주제 구독 </div>
                        <div className="text-[18px] text-[#919191] mt-[16px]">
                            News intelligent는 최대 20개의 주제별 구독을 제공합니다. 
                        </div>
                    </div>

                    <div className="flex mt-[36px] mb-[16px] w-[840px]">
                        <p className="font-medium text-[16px]">
                            현재 <span className="text-[#0B8E8E]">{newsList.length}개의 주제</span>를 구독 중입니다.
                        </p>
                    </div>

                    <div className="columns-2 [column-gap:1.3rem] space-y-5">
                        {newsList.map((item, idx) => (
                            <NewsCard key={(item as any).id ?? idx} data={item} />
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
>>>>>>> dc211f68bb11d5508cf4277dad9fe60d9f83fe83
    )

    if (loaderReference.current) {
      observer.observe(loaderReference.current)
    }

    return () => {
      if (loaderReference.current) {
        observer.unobserve(loaderReference.current)
      }
    }
  }, [getNews, more])

  return (
    <div className="h-[1031px]">
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
            <p className="font-medium text-[16px]">
              {' '}
              현재 <span className="text-[#0B8E8E]"> 11개의 주제</span>를 구독 중입니다.{' '}
            </p>
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

export default SubscriptionPage
