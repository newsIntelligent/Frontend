import { useEffect, useMemo, useRef, useState } from 'react'
import UpdatesSidebar from '../components/UpdatesSideBar'
import SubscribeButton from '../components/SubscribeButton'
import { axiosInstance } from '../api/axios' // 경로 확인
import { useSearchParams } from 'react-router-dom'

type Topic = {
  id: number
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
  // 서버에서 구독 여부 내려주면 여기에 추가하세요:
  // isSubscribed?: boolean
}

// ---- 로고 매핑 + 안전한 경로 해석 ----
const logoFileMap: Record<string, string> = {
  조선일보: 'media-chosun.svg',
  한겨레: 'media-hani.svg',
  경향신문: 'media-khan.svg',
  연합뉴스: 'media-yonhap.svg',
}

function resolveLogo(press?: string) {
  const file = (press && logoFileMap[press]) || 'default.svg'
  // src/assets 아래에 있을 때 Vite 번들링 호환 경로
  try {
    return new URL(`../assets/${file}`, import.meta.url).href
  } catch {
    return `/assets/${file}` // public/assets 에 둘 경우 대비
  }
}

const ArticlePage = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [article, setArticle] = useState<TopicDetail | null>(null)
  const [lastId, setLastId] = useState<number | null>(null)
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 서버에 존재하는 테스트 토픽 ID 사용
  const [searchParams] = useSearchParams()
  const topicId = useMemo(() => {
    const raw = searchParams.get('id')
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) && n > 0 ? n : null
  }, [searchParams])

  const pageSize = 3

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 142)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ----- 상단 기사 정보 API -----
  useEffect(() => {
    const controller = new AbortController()
    setError(null)
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/topic/${topicId}`, {
          signal: controller.signal,
        })
        setArticle(res.data?.result ?? null)
      } catch (e: any) {
        if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return
        console.error('상단 기사 API 호출 실패:', e)
        setError('상단 기사 정보를 불러오지 못했습니다.')
      }
    })()

    return () => controller.abort()
  }, [topicId])

  // ----- 하단 카드 API -----
  const fetchingRef = useRef(false)
  const fetchRelatedArticles = async (append = false) => {
    if (fetchingRef.current) return
    if (append && !hasNext) return

    fetchingRef.current = true
    setLoading(true)
    setError(null)
    const controller = new AbortController()

    try {
      const params: Record<string, any> = { size: pageSize }
      if (append && lastId) params.lastId = lastId

      const res = await axiosInstance.get(`/topic/${topicId}/related`, {
        params,
        signal: controller.signal,
      })

      const result = res.data?.result ?? {}
      const content = Array.isArray(result.content) ? result.content : []

      const mapped: Topic[] = content.map((item: any) => ({
        id: item.id ?? item.topicId,
        media: item.press,
        text: item.newsSummary,
        mediaLogo: resolveLogo(item.press),
      }))

      setTopics((prev) => (append ? [...prev, ...mapped] : mapped))
      setHasNext(Boolean(result.hasNext))
      setLastId(result.lastId ?? null)
    } catch (e: any) {
      if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return
      console.error('하단 카드 API 호출 실패:', e)
      setError('관련 토픽을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }

    // cleanup: 단발 호출이라 별도 abort는 반환하지 않음
  }

  // 첫 로드
  useEffect(() => {
    fetchRelatedArticles(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  // 날짜 표시
  const formattedSummaryTime = useMemo(() => {
    if (!article?.summaryTime) return ''
    try {
      return new Date(article.summaryTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }, [article?.summaryTime])

  if (!article) {
    return (
      <div className="flex justify-center bg-gray-50 overflow-visible min-h-screen">
        <div className="w-[1440px] flex overflow-visible min-h-screen">
          <aside className="sticky w-[320px] ml-[25px] top-[167px] self-start">
            <UpdatesSidebar />
          </aside>
          <main className="flex-1 pl-[40px] pr-8 max-w-[1000px]">
            <p>{error ?? '로딩 중...'}</p>
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
        <main className="flex-1 pl-[120px] pr-8 max-w-[1000px]">
          <div className="border-t-2 px-6 py-6 w-full">
            <div className="flex flex-wrap justify-between mb-2">
              <h1 className="text-xl font-bold leading-tight flex-1 min-w-[200px]">
                {article.topicName}
              </h1>
            </div>

            {formattedSummaryTime && (
              <p className="text-xs text-black mb-4">업데이트: {formattedSummaryTime}</p>
            )}

            <div className="mb-4">
              {/* 서버에서 구독 여부 내려주면 그 값으로 대체하세요 (예: article.isSubscribed ?? false) */}
              <SubscribeButton id={article.id} subscribe={false} size="large" />
            </div>

            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.topicName}
                className="w-full h-[360px] object-cover rounded mb-2"
                loading="lazy"
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

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <div className="flex flex-wrap gap-2 mb-8">
            {topics.map((topic, idx) => (
              <div
                key={`${topic.media}-${idx}`}
                className="flex flex-col gap-2 bg-gray-100 px-4 py-3 rounded-xl text-xs text-gray-800 w-[200px]"
              >
                <div className="flex items-center gap-1">
                  <img src={topic.mediaLogo} alt={topic.media} className="w-4 h-4" loading="lazy" />
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
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
