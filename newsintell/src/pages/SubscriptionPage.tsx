import Header from "../components/Header"
import MyPageSearchBar from "../components/MyPageSearchBar"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"
import SubscriptionCount from "../components/SubscriptionCount"

const MyPage = () => {
    return (
        <div className="h-[1031px]">
            <Header />

            <div className="flex w-full h-dvh px-[max(16px,calc((100vw-1240px)/2))]">
                <Sidebar />

                <div className="absolute flex-1 ml-[208.86px] mt-[179px]">
                    <div className="w-[387.54px] leading-none justify-center">
                        <div className="text-[32px] h-[33.94px] font-medium mt-[1.5px]"> 주제 구독 </div>

                        <div className="text-[18px] text-[#919191] h-[21px] font-light mt-[16px]">
                            News intelligent는 주제별 구독을 제공합니다.    
                        </div>
                    </div>

                    <div className="flex mt-[24px] mb-[24px] w-[840px] justify-between">
                        <MyPageSearchBar />
                        <SubscriptionCount />
                    </div>

                    <div>
                        <NewsCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPage
