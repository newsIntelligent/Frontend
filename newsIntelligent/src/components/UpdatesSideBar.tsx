import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axios'
import SubscribeButton from '../components/SubscribeButton'

/** 구독 단위: 'topic' | 'article'  */
const SUBSCRIBE_SCOPE: 'topic' | 'article' = 'topic'

/** 내부 표시용 아이템 타입 */
type LatestItem = {
  id: number
  press?: string
  title?: string
  updatedAt?: string
  imageUrl?: string
  summary?: string
  isSubscribed?: boolean
}

/** 서버 응답 타입(최신 스키마) */
type RelatedArticle = {
  id: number
  press?: string
  title?: string
  publishDate?: string
  newsSummary?: string
}

type LatestApiItem = {
  id: number
  topicName: string
  aiSummary?: string
  imageUrl?: string
  summaryTime?: string
  imageSource?: { press?: string; title?: string }
  isSubscribed?: boolean
  isSub?: boolean
  relatedArticles?: RelatedArticle[]
}

type LatestApiResultV2 = {
  items: LatestApiItem[]
}

/** 날짜 포맷 */
const fmt = (iso?: string) => {
  if (!iso) return '-'
  const d = new Date(iso)
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 라인 클램프(플러그인 없이 동작) */
const clamp3: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}
const clamp2: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}

export default function UpdatesSidebar() {
  const navigate = useNavigate()
  // 화면 표시용 상태
  const [hero, setHero] = useState<LatestItem | null>(null)
  const [sources, setSources] = useState<LatestItem[]>([]) // 메인 아래 3개(출처 기사)
  const [others, setOthers] = useState<LatestItem[]>([]) // 그 외 다른 토픽들
  const [topicId, setTopicId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // 순환용 원본 데이터 & 인덱스
  const [items, setItems] = useState<LatestApiItem[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)

  // 관련 기사 캐시 (topicId -> LatestItem[])
  const relatedCache = useRef<Map<number, LatestItem[]>>(new Map())

  // 공통: LatestApiItem -> 화면 상태로 변환 & 세팅
  const applyViewFromItem = async (it: LatestApiItem) => {
    // 대표 카드
    const heroCard: LatestItem = {
      id: it.id,
      press: it.imageSource?.press ?? '이미지',
      title: it.topicName,
      summary: it.aiSummary,
      updatedAt: it.summaryTime,
      imageUrl: it.imageUrl ?? '/src/assets/stk.jpg',
      isSubscribed: it.isSubscribed ?? it.isSub ?? false,
    }
    setHero(heroCard)
    setTopicId(it.id)

    // 관련 기사(캐시 → 응답 내장 → API 호출(폴백))
    let related: LatestItem[] | undefined = relatedCache.current.get(it.id)

    if (!related || related.length === 0) {
      if (it.relatedArticles && it.relatedArticles.length > 0) {
        related = it.relatedArticles.map((r) => ({
          id: r.id,
          press: r.press,
          title: r.title,
          summary: r.newsSummary,
          updatedAt: r.publishDate,
        }))
      } else {
        try {
          const rel = await axiosInstance.get(`/topic/${it.id}/related`, { params: { size: 6 } })
          const content = rel?.data?.result?.content ?? []
          related = (content as any[]).map((x) => ({
            id: x.id ?? x.topicId,
            press: x.press,
            title: x.title,
            summary: x.newsSummary,
            updatedAt: x.publishDate,
          }))
        } catch {
          related = []
        }
      }
      relatedCache.current.set(it.id, related || [])
    }

    setSources((related || []).slice(0, 3))

    // other 목록: 현재 아이템 제외하고 나머지를 표시
    const rest = items
      .filter((t) => t.id !== it.id)
      .map((t) => ({
        id: t.id,
        press: t.imageSource?.press,
        title: t.topicName,
        summary: t.aiSummary,
        updatedAt: t.summaryTime,
        imageUrl: t.imageUrl,
        isSubscribed: t.isSubscribed ?? t.isSub ?? false,
      }))
    setOthers(rest)
  }

  // 최초 로딩
  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setErr(null)

        const { data } = await axiosInstance.get('/topic/latest')
        const raw = data?.result as LatestApiResultV2 | undefined
        const list = raw?.items ?? []

        setItems(list)

        if (list.length === 0) {
          setHero(null)
          setSources([])
          setOthers([])
          setTopicId(null)
          return
        }

        // 첫 아이템으로 초기화
        await applyViewFromItem(list[0])
        setCurrentIdx(0)
      } catch (e: any) {
        const code = e?.response?.status
        if (code === 404) {
          setHero(null)
          setSources([])
          setOthers([])
        } else if (code === 401 || code === 403) setErr('인증이 필요합니다.')
        else setErr('목록을 불러오지 못했어요.')
        setTopicId(null)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 10초 자동 전환 (아이템이 2개 이상일 때만) - 임시 비활성화
  // useEffect(() => {
  //   if (items.length <= 1) return

  //   const tick = async () => {
  //     const next = (currentIdx + 1) % items.length
  //     setCurrentIdx(next)
  //     await applyViewFromItem(items[next])
  //   }

  //   const id = setInterval(tick, 10_000)
  //   return () => clearInterval(id)
  //   // currentIdx, items 둘 다 의존. items가 바뀌면 다시 세팅됨
  // }, [currentIdx, items]) // applyViewFromItem은 ref/상태만 사용

  // 다른 페이지에서 구독 상태가 변경되었을 때 감지
  useEffect(() => {
    const handleSubscriptionChange = (e: CustomEvent) => {
      const { topicId: changedTopicId, isSubscribed } = e.detail
      console.log('UpdatesSideBar - 구독 상태 변경 감지:', changedTopicId, isSubscribed)

      // hero 업데이트
      if (hero && hero.id === changedTopicId) {
        setHero((prev) => (prev ? { ...prev, isSubscribed } : null))
      }

      // others 업데이트
      setOthers((prev) =>
        prev.map((item) => (item.id === changedTopicId ? { ...item, isSubscribed } : item))
      )

      // items 업데이트 (원본 데이터도 업데이트)
      setItems((prev) =>
        prev.map((item) =>
          item.id === changedTopicId ? { ...item, isSubscribed, isSub: isSubscribed } : item
        )
      )
    }

    window.addEventListener('subscriptionChanged', handleSubscriptionChange as EventListener)
    return () =>
      window.removeEventListener('subscriptionChanged', handleSubscriptionChange as EventListener)
  }, [hero])



  // 구독 ID 결정
  const subIdFor = (it?: LatestItem) => {
    if (SUBSCRIBE_SCOPE === 'article') return it?.id ?? topicId ?? 0
    return it?.id ?? topicId ?? 0
  }

  return (
    <aside className="sticky top-[10px] w-[320px]">
      <div className="border-t-2 px-4 py-5 h-full">
        <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-3">최신수정보도</h2>

        {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
        {err && <p className="text-sm text-red-500">{err}</p>}
        {!loading && !err && !hero && (
          <div className="my-6 text-sm text-gray-500">최신 수정 보도가 아직 없어요.</div>
        )}

        {/* 대표 카드 */}
        {!loading && !err && hero && (
          <div
            className="mb-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded p-2 -m-2"
            onClick={() => navigate(`/article?id=${hero.id}`)}
          >
            <div className="mb-2">
              <div className="flex items-start gap-2 mb-1">
                <span className="flex-1 min-w-0 font-semibold text-sm leading-snug truncate">
                  {hero.title ?? '제목'}
                </span>
                <div className="flex-shrink-0">
                  <div onClick={(e) => e.stopPropagation()}>
                    <SubscribeButton
                      id={subIdFor(hero)}
                      subscribe={hero.isSubscribed ?? false}
                      size="default"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">업데이트 {fmt(hero.updatedAt)}</span>
            </div>

            <div className="flex gap-3 mb-2 items-start">
              <img
                src={hero.imageUrl ?? '/src/assets/stk.jpg'}
                alt="뉴스 이미지"
                className="w-[96px] h-[60px] object-cover rounded"
                loading="lazy"
              />
              {/* 요약 3줄만 노출 */}
              <p className="text-sm text-gray-800 leading-snug mb-3" style={clamp3}>
                {hero.summary ?? hero.title ?? ''}
              </p>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 leading-tight mb-3">
              이미지 · {hero.press ?? '-'}
            </p>
          </div>
        )}

        {!loading && !err && sources.length > 0 && <hr className="my-5 border-gray-300" />}

        {/* 메인 아래 3개: 출처 기사(구독 버튼 제거) */}
        {!loading && !err && sources.length > 0 && (
          <ul className="space-y-5 mb-8">
            {sources.map((it, i) => (
              <li key={`${it.id}-${i}`} className="flex gap-2 items-start text-xs leading-snug">
                <div
                  className={`w-2 h-2 rounded-full mt-[5px] ${
                    i === 2 ? 'bg-gray-400' : 'bg-sky-500'
                  }`}
                />
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] text-gray-500 mb-0.5">
                    {it.press ?? '-'} · {fmt(it.updatedAt)}
                  </span>
                  <span className="text-gray-800">{it.title}</span>
                </div>
                {/* 구독 버튼 없음 */}
              </li>
            ))}
          </ul>
        )}

        {!loading && !err && others.length > 0 && <hr className="my-5 border-gray-300" />}

        {/* 그 외 다른 기사(버튼 안 밀리게 고정) */}
        {!loading && !err && others.length > 0 && (
          <div className="text-sm">
            {others.map((item, idx) => (
              <React.Fragment key={`${item.id}-${idx}`}>
                <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                  {/* 텍스트 영역(최대 2줄로 고정 높이 비슷하게) */}
                  <div className="min-w-0">
                    <div className="font-medium leading-tight" style={clamp2}>
                      {item.title ?? ''}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">업데이트 {fmt(item.updatedAt)}</div>
                  </div>

                  {/* 버튼 영역: 항상 우측 상단 고정 */}
                  <div className="row-span-2 self-start">
                    <div onClick={(e) => e.stopPropagation()}>
                      <SubscribeButton
                        id={subIdFor(item)}
                        subscribe={item.isSubscribed ?? false}
                        size="default"
                      />
                    </div>
                  </div>
                </div>
                <hr className="my-5 border-gray-300" />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
