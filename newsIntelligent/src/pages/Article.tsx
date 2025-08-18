import { useEffect, useMemo, useRef, useState } from 'react'
import UpdatesSidebar from '../components/UpdatesSideBar'
import SubscribeButton from '../components/SubscribeButton'
import { axiosInstance } from '../api/axios'
import { useSearchParams } from 'react-router-dom'

const logoFileMap = {
  조선일보: 'media-chosun.svg',
  한겨레: 'media-hani.svg',
  경향신문: 'media-khan.svg',
  연합뉴스: 'media-yonhap.svg',
}

function resolveLogo(press) {
  const file = (press && logoFileMap[press]) || 'default.svg'
  try {
    return new URL(`../assets/${file}`, import.meta.url).href
  } catch {
    return `/assets/${file}`
  }
}

const ArticlePage = () => {
  const [topics, setTopics] = useState([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [article, setArticle] = useState(null)
  const [lastId, setLastId] = useState(null)
  const [hasNext, setHasNext] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const topicId = useMemo(() => {
    const raw = searchParams.get('id')
    const n = raw ? Number(raw) : NaN
    return Number.isFinite(n) && n > 0 ? n : null
  }, [searchParams])

  const pageSize = 3
  const fetchingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 142)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setError(null)
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/topic/${topicId}`, {
          signal: controller.signal,
        })
        setArticle(res.data?.result ?? null)
      } catch (e) {
        if (e.name !== 'CanceledError') {
          setError('상단 기사 정보를 불러오지 못했습니다.')
        }
      }
    })()
    return () => controller.abort()
  }, [topicId])

  const fetchRelatedArticles = async (append = false) => {
    if (fetchingRef.current || (append && !hasNext)) return

    fetchingRef.current = true
    setLoading(true)
    setError(null)
    try {
      const params = { size: pageSize }
      if (append && lastId) params.lastId = lastId

      const res = await axiosInstance.get(`/topic/${topicId}/related`, { params })
      const result = res.data?.result ?? {}
      const content = Array.isArray(result.content) ? result.content : []

      const mapped = content.map((item) => ({
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
    } catch (e) {
      if (e.name !== 'CanceledError') {
        setError('관련 토픽을 불러오지 못했습니다.')
      }
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchRelatedArticles(false)
  }, [topicId])

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

  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex justify-center bg-gray-50 overflow-visible">
      <div className="w-[1440px] flex overflow-visible min-h-screen">
        <aside
          className={`sticky w-[320px] ml-[25px] self-start ${isScrolled ? 'top-[75px]' : 'top-[167px]'}`}
        >
          <UpdatesSidebar />
        </aside>

        <main className="flex-1 pl-[120px] pr-8 max-w-[1000px]">
          <div className="border-t-2 px-6 py-6 w-full">
            <h1 className="text-xl font-bold leading-tight mb-2">{article?.topicName}</h1>
            {formattedSummaryTime && (
              <p className="text-xs text-black mb-4">업데이트: {formattedSummaryTime}</p>
            )}
            <SubscribeButton id={article?.id} subscribe={false} size="large" />
            {article?.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.topicName}
                className="w-full h-[360px] object-cover rounded my-3"
              />
            )}
            <p className="text-[11px] text-gray-400 mb-4">이미지 · {article?.topicName}</p>

            {article?.aiSummary && (
              <article className="text-sm text-gray-800 leading-relaxed mb-8">
                <p className={`line-clamp-${expanded ? 'none' : '3'} transition-all`}>
                  {article.aiSummary}
                </p>
                {!expanded && (
                  <button className="text-blue-500 text-xs mt-2" onClick={() => setExpanded(true)}>
                    더보기
                  </button>
                )}
              </article>
            )}
          </div>

          <hr className="my-4 border-gray-300" />

          <p className="text-[14px] text-gray-400 mb-4">
            해당 AI 요약글에 사용된 원본 토픽입니다. 최신순으로 정렬됩니다.
          </p>

          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

          <div className="flex flex-wrap gap-4 mb-8">
            {topics.map((topic, idx) => (
              <a
                key={`${topic.media}-${idx}`}
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
