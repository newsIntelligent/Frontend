import { useEffect, useState } from 'react'
import UpdatesSidebar from '../components/UpdatesSideBar'
type Topic = {
  media: string
  text: string
  mediaLogo: string
}

const ArticlePage = () => {
  const [topics, setTopics] = useState<Topic[]>([]) //  타입 명시
  const [extraTopics, setExtraTopics] = useState<Topic[]>([]) //  타입 명시
  const [isScrolled, setIsScrolled] = useState(false)

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 142)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // dummy 토픽 불러오기
  useEffect(() => {
    const dummyData = [
      {
        media: '조선일보',
        text: '네타냐후에 전환 겸여 이란 공격자 제 당부 “휴전은 여전히 유지…”',
        mediaLogo: 'media-chosun.svg',
      },
      {
        media: '한겨레',
        text: '대통령실  “휴전은 여전히 유지…” ',
        mediaLogo: 'media-hani.svg',
      },
      {
        media: '경향신문',
        text: '최고위서 교체된 청년대변인 “당 쇄신 필요”',
        mediaLogo: 'media-khan.svg',
      },
    ]
    setTopics(dummyData)
  }, [])

  // "토픽 더보기" 클릭 시
  const handleLoadMore = () => {
    const more = Array.from({ length: 9 }, (_, i) => ({
      media: '연합뉴스',
      text: `추가된 토픽 ${i + 1}`,
      mediaLogo: 'media-yonhap.svg',
    }))
    setExtraTopics(more)
  }

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="w-[1440px] flex">
        {/* 왼쪽: 사이드바 */}
        <div
          className={`sticky w-[320px] h-[calc(100vh-167px)] ${
            isScrolled ? 'top-[75px]' : 'top-[167px]'
          }`}
        >
          <UpdatesSidebar />
        </div>

        {/* 오른쪽: 기사 본문 */}
        <main className="flex-1 pt-[px] pl-[140px] pr-8 max-w-[1000px]">
          <div className="border-t-2 px-6 py-6 w-full">
            <h1 className="text-xl font-bold leading-tight mb-2">
              트럼프와 일론머스크, 정치적 논쟁
            </h1>
            <p className="text-xs black mb-4">박민하 | 05/03 23:50</p>
            <img
              src="/src/assets/trump-elon.jpg"
              alt="트럼프와 일론머스크"
              className="w-full h-[360px] object-cover rounded mb-2"
            />
            <p className="text-[11px] text-gray-400 mb-6">
              이미지 · 조선일보 “고양이가 크게 우는 이유, 유전자에 숨겨져 있을지도…”
            </p>

            {/* 본문 */}
            <article className="text-sm text-gray-800 leading-relaxed mb-8 space-y-5">
              <p>
                본 글은 포털 미디어에 아무거나 써달라고 해서 작성되었습니다. 햇빛이 유난히 부드럽던
                어느 늦은 오후, 사람들은 저마다의 정론으로 하루를 지나가고 있었다.
              </p>

              <p>
                책상 위에는 다 마신 커피캔과 펼쳐진 책이 놓여 있었다. 확장을 넘긴 날이 초래됐지만,
                일단 내용을 기억하지 못해 다시 첫 문장을 더듬으며 읽기 시작했다.
              </p>

              <p>
                모두 사계를 바라보며 오후 네 시를 기억하고 있었다. 하루 중 가장 애매한 시간, 높은
                천장선이 만든 저녁빛의 둔율 위로, 문을 나설 이유를 망각한 채.
              </p>

              <p>
                생각해보면 우리는 늘 무언가를 하고 있다. 영화를 채우고, 약속을 지키고, 계획을 짜고.
                원하는 책을 읽는 척하다가, 한참을 골몰하듯이 앉아있어 아무것도 하지 않고 있는 시간도
                필요하다.
              </p>

              <p>
                밖에서는 새들이 날아들며 나뭇가지 사이를 즐기며 떠났다. 고요한 시간은 계속 흐르고
                있었고, 그 안에서 나는 조용히 숨을 쉬었다.
              </p>

              <p>
                생각해보면 우리는 늘 무언가를 하고 있다. 영화를 채우고, 약속을 지키고, 계획을 짜고.
                원하는 책을 읽는 척하다가, 한참을 골몰하듯이 앉아있어 아무것도 하지 않고 있는 시간도
                필요하다.
              </p>

              <p>
                생각해보면 우리는 늘 무언가를 하고 있다. 영화를 채우고, 약속을 지키고, 계획을 짜고.
                원하는 책을 읽는 척하다가, 한참을 골몰하듯이 앉아있어 아무것도 하지 않고 있는 시간도
                필요하다.
              </p>

              <p>
                생각해보면 우리는 늘 무언가를 하고 있다. 영화를 채우고, 약속을 지키고, 계획을 짜고.
                원하는 책을 읽는 척하다가, 한참을 골몰하듯이 앉아있어 아무것도 하지 않고 있는 시간도
                필요하다.
              </p>

              <p>
                햇살이 느릿하게 커튼 사이로 스며들었다. 잠든 나뭇잎들은 바람의 입김에 살짝 고개를
                흔든다. 그 조용한 떨림은 마치 오래된 편지를 꺼내 읽는 기분과도 같다. 잊힌 기억의
                언저리가 부드럽게 피어오른다. 나는 오늘도 말을 아낀다. 말보다 침묵이, 설명보다
                눈빛이 더 많은 것을 말해줄 때가 있으니까. 종이컵 속 식은 커피 위로 햇살이 한 줄기
                내려앉는다. 세상은 여전히 분주하지만, 이 순간만큼은 정지된 듯하다. 누군가의 하루에
                내가 작은 쉼표가 될 수 있다면, 그것만으로도 충분하다고 생각했다.
              </p>
              <p>
                햇살이 느릿하게 커튼 사이로 스며들었다. 잠든 나뭇잎들은 바람의 입김에 살짝 고개를
                흔든다. 그 조용한 떨림은 마치 오래된 편지를 꺼내 읽는 기분과도 같다. 잊힌 기억의
                언저리가 부드럽게 피어오른다. 나는 오늘도 말을 아낀다. 말보다 침묵이, 설명보다
                눈빛이 더 많은 것을 말해줄 때가 있으니까. 종이컵 속 식은 커피 위로 햇살이 한 줄기
                내려앉는다. 세상은 여전히 분주하지만, 이 순간만큼은 정지된 듯하다. 누군가의 하루에
                내가 작은 쉼표가 될 수 있다면, 그것만으로도 충분하다고 생각했다.
              </p>
            </article>
          </div>

          <div className="bg-white border-t border-gray-300 px-6 py-2 pt-2 w-full" />
          <p className="text-[14px] text-gray-400 mb-4">
            해당 AI 요약글에 사용된 원본 토픽입니다. 최신순으로 정렬됩니다.
          </p>

          <div className="flex flex-wrap gap-2 mb-16">
            {[...topics, ...extraTopics].map((topic, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 bg-gray-100 px-4 py-3 rounded-xl text-xs text-gray-800 w-[200px]"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={`/src/assets/${topic.mediaLogo}`}
                    alt={topic.media}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-500">{topic.media}</span>
                </div>
                <span className="text-[11px] leading-snug break-words">{topic.text}</span>
              </div>
            ))}

            {!extraTopics.length && (
              <div
                onClick={handleLoadMore}
                className="flex flex-col gap-2 bg-gray-100 px-4 py-3 rounded-xl text-xs text-gray-800 w-[150px] cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <img src="/src/assets/media-chosun.svg" className="w-4 h-4" />
                  <img src="/src/assets/media-hani.svg" className="w-4 h-4" />
                  <img src="/src/assets/naver.svg" className="w-4 h-4" />
                  <span className="text-gray-500">외 19건</span>
                </div>
                <span className="text-gray-500 font-semibold">+ 토픽 더보기</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ArticlePage
