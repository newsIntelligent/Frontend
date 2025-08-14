import { useEffect, useState } from 'react'
import UpdatesSidebar from '../components/UpdatesSideBar'
import SubscribeButton from '../components/SubscribeButton'
import axios from 'axios'

type Topic = {
  media: string
  text: string
  mediaLogo: string
}

type TopicDetail = {
  id: number
  topicName: string
  aiSummary?: string
  imageUrl?: string
  summaryTime?: string
}

// 로고 매핑
const logoMap: Record<string, string> = {
  조선일보: 'media-chosun.svg',
  한겨레: 'media-hani.svg',
  경향신문: 'media-khan.svg',
  연합뉴스: 'media-yonhap.svg',
}

const ArticlePage = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [article, setArticle] = useState<TopicDetail | null>(null)
  const [lastId, setLastId] = useState<number | null>(null)
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)

  const topicId = 80 // 테스트 데이터 있는 ID 사용
  const pageSize = 8

  //  Access Token 가져오기
  // const token = localStorage.getItem('accessToken')
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlNzQwNWE1My1kZDVkLTQ1OTctODc1Ny1hMmRiYTQ5NmM1MGYiLCJzdWIiOiJoZWVqdW5nX184MTE0QG5hdmVyLmNvbSIsImlkIjo2LCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzU1MTkyMjc5LCJleHAiOjE3NTUyMDY2Nzl9.QowigKFmDL5phMhA9aEoIXQZjM_f91mhZhAbPWWxNq0'

  // Axios 기본 인스턴스
  const api = axios.create({
    baseURL: 'https://api.newsintelligent.site/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 142)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 상단 기사 정보 API
  useEffect(() => {
    api
      .get(`/topic/${topicId}`)
      .then((res) => setArticle(res.data.result))
      .catch((err) => console.error('상단 기사 API 호출 실패:', err))
  }, [topicId])

  // 하단 카드 API
  const fetchRelatedArticles = async (append = false) => {
    if (append && !hasNext) return
    setLoading(true)
    try {
      const params: any = { size: pageSize }
      if (append && lastId) params.lastId = lastId

      const res = await api.get(`/topic/${topicId}/related`, { params })

      const content = res.data.result.content || []
      const mapped = content.map((item: any) => ({
        media: item.press,
        text: item.newsSummary,
        mediaLogo: logoMap[item.press] || 'default.svg',
      }))

      setTopics((prev) => (append ? [...prev, ...mapped] : mapped))
      setHasNext(res.data.result.hasNext)
      setLastId(res.data.result.lastId)
    } catch (err) {
      console.error('하단 카드 API 호출 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  // 첫 로드
  useEffect(() => {
    fetchRelatedArticles(false)
  }, [topicId])

  if (!article) {
    return (
      <div className="flex justify-center bg-gray-50 overflow-visible min-h-screen">
        <div className="w-[1440px] flex overflow-visible min-h-screen">
          <aside className="sticky w-[320px] ml-[25px] top-[167px] self-start">
            <UpdatesSidebar />
          </aside>
          <main className="flex-1 pl-[40px] pr-8 max-w-[1000px]">
            <p>로딩 중...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center bg-gray-50 overflow-visible">
      <div className="w-[1440px] flex overflow-visible min-h-screen">
        {/* 왼쪽: 사이드바 */}
        <aside
          className={`sticky w-[320px] ml-[25px] self-start ${
            isScrolled ? 'top-[75px]' : 'top-[167px]'
          }`}
        >
          <UpdatesSidebar />
        </aside>

        {/* 오른쪽: 기사 본문 */}
        <main className="flex-1 pl-[40px] pr-8 max-w-[1000px]">
          <div className="border-t-2 px-6 py-6 w-full">
            <div className="flex flex-wrap justify-between mb-2">
              <h1 className="text-xl font-bold leading-tight flex-1 min-w-[200px]">
                {article.topicName}
              </h1>
            </div>

            {article.summaryTime && (
              <p className="text-xs text-black mb-4">
                업데이트: {new Date(article.summaryTime).toLocaleString()}
              </p>
            )}

            <div className="mb-4">
              {/* ↓↓↓ 필수 prop: id 추가 */}
              <SubscribeButton id={article.id} sub={false} size="large" />
            </div>

            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.topicName}
                className="w-full h-[360px] object-cover rounded mb-2"
              />
            )}

            <p className="text-[11px] text-gray-400 mb-6">이미지 · {article.topicName}</p>

            {article.aiSummary && (
              <article className="text-sm text-gray-800 leading-relaxed mb-8 space-y-5">
                <p>{article.aiSummary}</p>
              </article>
            )}
          </div>

          <div className="bg-white border-t border-gray-300 px-6 py-2 pt-2 w-full" />
          <p className="text-[14px] text-gray-400 mb-4">
            해당 AI 요약글에 사용된 원본 토픽입니다. 최신순으로 정렬됩니다.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {topics.map((topic, idx) => (
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
          </div>

          {hasNext && (
            <div className="flex justify-center mb-16">
              <button
                onClick={() => fetchRelatedArticles(true)}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
              >
                {loading ? '불러오는 중...' : '+ 토픽 더보기'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ArticlePage
