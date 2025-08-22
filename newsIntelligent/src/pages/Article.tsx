// src/pages/Article.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import UpdatesSidebar from '../components/UpdatesSideBar'
import SubscribeButton from '../components/SubscribeButton'
import { axiosInstance } from '../api/axios'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

// ---- 타입 선언 ----
type Article = {
  id: number
  topicName: string
  aiSummary?: string
  imageUrl?: string
  summaryTime?: string
}

type RelatedAPIItem = {
  id: number
  title: string
  newsSummary: string
  newsLink: string
  press: string
  publishDate?: string
  pressLogoUrl?: string
}

type TopicCard = {
  id: number
  title: string
  text: string
  link: string
  media: string
  publishDate?: string
  mediaLogo: string
}

type RelatedListResult = {
  content: RelatedAPIItem[]
  hasNext?: boolean
  lastId?: number | null
}

// ---- 로고 맵 & 안전한 접근 ----
const logoFileMap = {
  조선일보: 'media-chosun.svg',
  한겨레: 'media-hani.svg',
  경향신문: 'media-khan.svg',
  연합뉴스: 'media-yonhap.svg',
} as const

function resolveLogo(press?: string) {
  let file = 'default.svg'
  if (press && press in logoFileMap) {
    file = logoFileMap[press as keyof typeof logoFileMap]
  }
  try {
    return new URL(`../assets/${file}`, import.meta.url).href
  } catch {
    return `/assets/${file}`
  }
}

const ArticlePage = () => {
  const [topics, setTopics] = useState<TopicCard[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [lastId, setLastId] = useState<number | null>(null)
  const [hasNext, setHasNext] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const topicId = useMemo(() => {
    const raw = searchParams.get('id')
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) && n > 0 ? n : null
  }, [searchParams])

  const pageSize = 9
  const fetchingRef = useRef<boolean>(false)

  // 스크롤 고정: lg 이상에서만 sticky 오프셋 적용
  useEffect(() => {
    const handleScrollOrResize = () => {
      if (window.innerWidth >= 1024) {
        setIsScrolled(window.scrollY > 142)
      } else {
        setIsScrolled(false)
      }
    }
    handleScrollOrResize()
    window.addEventListener('scroll', handleScrollOrResize)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [])

  // 상단 기사 로딩
  useEffect(() => {
    if (!topicId) {
      setArticle(null)
      return
    }
    const controller = new AbortController()
    setError(null)
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/topic/${topicId}`, {
          signal: controller.signal,
        })
        const result = (res.data?.result ?? null) as Article | null
        setArticle(result)
      } catch (e: unknown) {
        if (axios.isCancel(e)) return
        setError('상단 기사 정보를 불러오지 못했습니다.')
      }
    })()
    return () => controller.abort()
  }, [topicId])

  // 관련 토픽 로딩
  const fetchRelatedArticles = async (append = false) => {
    if (!topicId) return
    if (fetchingRef.current || (append && !hasNext)) return

    fetchingRef.current = true
    setLoading(true)
    setError(null)
    try {
      const params: { size: number; lastId?: number | null } = { size: pageSize }
      if (append && lastId) params.lastId = lastId

      const res = await axiosInstance.get(`/topic/${topicId}/related`, { params })
      const result = (res.data?.result ?? {}) as RelatedListResult
      const content = Array.isArray(result.content) ? (result.content as RelatedAPIItem[]) : []

      const mapped: TopicCard[] = content.map((item: RelatedAPIItem) => ({
        id: item.id,
        title: item.title,
        text: item.newsSummary,
        link: item.newsLink,
        media: item.press,
        publishDate: item.publishDate,
        mediaLogo: item.pressLogoUrl ?? resolveLogo(item.press),
      }))

      setTopics((prev) => (append ? [...prev, ...mapped] : mapped))
      setHasNext(Boolean(result.hasNext))
      setLastId(result.lastId ?? null)
    } catch (e: unknown) {
      if (!axios.isCancel(e)) {
        setError('관련 토픽을 불러오지 못했습니다.')
      }
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchRelatedArticles(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  // 요약 시간 포맷팅
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

  return (
    <div className="w-full overflow-x-hidden"> 
    <div className='w-[1440px] flex  min-h-screen px-[max(16px,calc((100vw-1280px)/2))] gap-[90px]'>
    <aside
                className={`sticky w-[320px] self-start 
                  ${isScrolled ? 'top-[75px]' : ""}`}
              >
                <UpdatesSidebar />
              </aside>

      
    <main className="w-[840px]">
          <div className="flex flex-col border-t-2 px-6 py-6 w-[840px]">
            <h1 className="text-xl font-bold leading-tight mb-2">{article?.topicName}</h1>
            {formattedSummaryTime && (
              <p className="text-xs text-black mb-4">업데이트: {formattedSummaryTime}</p>
            )}

            {article && <SubscribeButton id={article.id} subscribe={false} size="large" />}

            {article?.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.topicName || 'topic image'}
                className="w-full h-[360px] object-cover rounded my-3"
              />
            )}
            <p className="text-[11px] text-gray-400 mb-4">이미지 · {article?.topicName}</p>

            {article?.aiSummary && (
              <article className="text-sm text-gray-800 leading-relaxed mb-8">
                <p className="transition-all whitespace-pre-line">{article.aiSummary}</p>
              </article>
            )}
          </div>

          <hr className="my-4 border-gray-300" />

          <p className="text-[14px] text-gray-400 mb-4">
            해당 AI 요약글에 사용된 원본 토픽입니다. 최신순으로 정렬됩니다.
          </p>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <div className="flex flex-wrap gap-4 mb-8">
            {topics.map((topic) => (
              <a
                key={topic.id}
                href={topic.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-2 bg-gray-100 px-4 py-3 rounded-xl text-xs text-gray-800 w-[200px] hover:shadow"
              >
                <div className="flex items-center gap-1">
                  <img src={topic.mediaLogo} alt={topic.media} className="w-4 h-4" loading="lazy" />
                  <span className="text-gray-500 text-[11px]">{topic.media}</span>
                </div>
                <p className="text-[11px] leading-snug break-words line-clamp-3">{topic.text}</p>
              </a>
            ))}
          </div>

          {hasNext && (
            <div className="flex justify-center mb-16">
              <button
                onClick={() => fetchRelatedArticles(true)}
                disabled={loading}
                className="px-6 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
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
