import MainArticle from "../components/MainArticle";
import MainArticleCard from "../components/MainArticleCard";
import { useInfiniteQuery} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useThrottle from "../hooks/useThrottle";
import SkeletonCard from "../components/SkeletonCard";
import UpdatesSidebar from "../components/UpdatesSideBar";
import { topicHome } from "../api/topic";


function MainPage() {
    const [isScrolled, setIsScrolled] = useState(false)
  
    // 스크롤 감지
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 142)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    

    const {
        data,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      } = useInfiniteQuery({
        queryKey: ['articles', 10],
        initialPageParam: 0,
        queryFn: ({ pageParam = 0 }) => topicHome(pageParam, 10),
        getNextPageParam: (lastPage) => {
          const nextCursor = lastPage?.result;
          return nextCursor && nextCursor.hasNext? nextCursor.cursor : undefined;
        }
      });

      const items = data?.pages.flatMap(p => p.result.topics ?? []) ?? [];4
      const [main, ...list] = items;
      
      const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
      });
      
        const throttleInView = useThrottle(inView, 1000);
      
      useEffect(() => {
        if (throttleInView && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
          console.log("다음페이지 요청")
        }
      }, [throttleInView, hasNextPage, isFetchingNextPage, fetchNextPage]);


if (isLoading) return 
if (error) return <p>에러가 발생했습니다.</p>;
if (!data) return null;

return (
  <div className="flex justify-center">
    <div
          className={`sticky w-[320px] h-[calc(100vh-167px)] ${
            isScrolled ? 'top-[75px]' : 'top-[167px]'
          }`}
        >
          <UpdatesSidebar />
        </div>

    <div className="pl-[140px] pr-8">
                  {data && items.length > 0 && (
                    <>
                    {main && <MainArticle {...main} />}
                    <div className="grid grid-cols-2 w-[840px] gap-x-[20px] gap-y-[20px] py-[24px]">
                    {list.map((topic) => (
                      <MainArticleCard key={topic.id} {...topic} />
                    ))}
               {(isFetchingNextPage || throttleInView) && <SkeletonCard />}
                    </div>
                    <div ref={ref}/>
                    </>
                  )}
                </div>
    
  </div>

)
}

export default MainPage;