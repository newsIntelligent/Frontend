
import MainArticle from "../components/MainArticle";
import MainArticleCard from "../components/MainArticleCard";
import FeedBack from "../components/FeedBack";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import useThrottle from "../hooks/useThrottle";
import { fetchMockArticles } from "../api/fetchMockArticles";
import SkeletonCard from "../components/SkeletonCard";


function MainPage() {
    
    const {
        data,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      } = useInfiniteQuery({
        queryKey: ['articles'],
        queryFn: fetchMockArticles,
        initialPageParam: 1, 
        getNextPageParam: (lastPage) => lastPage.nextPage, 
      });
      
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
    <div className="relative w-full flex justify-center overflow-x-clip">
        <div className="max-w-[1440px] w-full flex justify-center overflow-x-clip">
            <div className="w-full flex gap-[90px] pl-[112px] pr-[100px]">
                <div className="w-[298px] h-[698px] border border-black"></div>
                <div>
                  {data && (
                    <>
                    <MainArticle {...data.pages[0].articles[0]}/>
                    <div className="grid grid-cols-2 w-[840px] gap-x-[20px] gap-y-[20px] py-[24px]">
                    {data.pages.map((page, pageIndex) =>
                page.articles.map((article) => (
                  <MainArticleCard key={`${pageIndex}-${article.id}`} {...article} />
                ))
                
              )}
               {(isFetchingNextPage || throttleInView) && <SkeletonCard />}
                    </div>


                    <div ref={ref}/>
                    </>
                  )}
                    
                    
                </div>
            </div>
        </div>
        <FeedBack />
    </div>
)
}

export default MainPage;