import { useState } from "react";
import LoadMoreButton from "../components/LoadMoreButton";
import MainArticle from "../components/MainArticle";
import MainArticleCard from "../components/MainArticleCard";
import FeedBack from "../components/FeedBack";

function MainPage() {
  const data = [
    {
      id: 1,
      title: "집 강아지 ‘콩이’의 유행 입니다",
      description:
        "2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 HSS(Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로 이어질 우려가 제기되었습니다 . 2025년 4월, SK텔레콤의 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 들어왔스빈다",
      imageUrl: "/src/assets/img.jpg",
      imgSource: "조선일보 '고양이가 크게 울면 안 돼 울면 안 돼'",
      updatedAt: "05/03 23:50",
    },
    {
      id: 2,
      title: "집 강아지 ‘콩이’의 유행 시발점",
      description:
        "2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었습니다. 이것은 강아지 콩이가 콩콩",
      imageUrl: "/src/assets/img.jpg",
      imgSource: "조선일보 '고양이가 크게 울면 안 돼 울면 안 돼'",
      updatedAt: "05/03 23:50",
    },
    {
      id: 3,
      title: "집 강아지 ‘콩이’의 유행 시발점",
      description:
        "2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었습니다. 이것은 강아지 콩이가 콩콩",
      imageUrl: "/src/assets/img.jpg",
      imgSource: "조선일보 '고양이가 크게 울면 안 돼 울면 안 돼'",
      updatedAt: "05/03 23:50",
    },
    {
      id: 4,
      title: "집 강아지 ‘콩이’의 유행 시발점",
      description:
        "2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었습니다. 이것은 강아지 콩이가 콩콩",
      imageUrl: "/src/assets/img.jpg",
      imgSource: "조선일보 '고양이가 크게 울면 안 돼 울면 안 돼'",
      updatedAt: "05/03 23:50",
    },
    {
      id: 5,
      title: "집 강아지 ‘콩이’의 유행 시발점",
      description:
        "2025년 4월, SK텔레콤의 핵심 가입자 인증 서버인 (Home Subscriber Server)가 해킹당해 약 9.7GB 규모의 유심(USIM) 관련 정보가 유출되었습니다. 이것은 강아지 콩이가 콩콩",
      imageUrl: "/src/assets/img.jpg",
      imgSource: "조선일보 '고양이가 크게 울면 안 돼 울면 안 돼'",
      updatedAt: "05/03 23:50",
    },
    // 추가 데이터 항목들...
  ];
  const [count, setCount] = useState(4);
  const handleLoadMore = () => {
    setCount(count + 4);
  };
  return (
    <div className="relative w-full flex justify-center overflow-x-clip">
      <div className="max-w-[1440px] w-full flex justify-center overflow-x-clip">
        <div className="w-full flex gap-[90px] pl-[112px] pr-[100px]">
          <div className="w-[298px] h-[698px] border border-black"></div>
          <div>
            <MainArticle {...data[0]} />
            <div className="grid grid-cols-2 w-[840px] gap-x-[20px] gap-y-[20px] py-[24px]">
              {data.slice(0, count).map((article) => (
                <MainArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  imageUrl={article.imageUrl}
                  imgSource={article.imgSource}
                  updatedAt={article.updatedAt}
                />
              ))}
            </div>
            <LoadMoreButton onClick={handleLoadMore} />
          </div>
        </div>
      </div>
      <FeedBack />
    </div>
  );
}

export default MainPage;
