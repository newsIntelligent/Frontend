import React, { useEffect, useMemo, useState } from 'react'
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
  const [hero, setHero] = useState<LatestItem | null>(null)
  const [sources, setSources] = useState<LatestItem[]>([]) // 메인 아래 3개(출처 기사)
  const [others, setOthers] = useState<LatestItem[]>([]) // 그 외 다른 토픽들
  const [topicId, setTopicId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setErr(null)

        const { data } = await axiosInstance.get('/topic/latest')
        const raw = data?.result as LatestApiResultV2 | undefined
        const first: LatestApiItem | undefined =
          raw && Array.isArray(raw.items) && raw.items.length > 0 ? raw.items[0] : undefined

        if (!first) {
          setHero(null)
          setSources([])
          setOthers([])
          setTopicId(null)
          return
        }

        setTopicId(first.id)

        // 대표 카드
        const heroCard: LatestItem = {
          id: first.id,
          press: first.imageSource?.press ?? '이미지',
          title: first.topicName,
          summary: first.aiSummary,
          updatedAt: first.summaryTime,
          imageUrl: first.imageUrl ?? '/src/assets/stk.jpg',
          isSubscribed: first.isSubscribed ?? first.isSub ?? false,
        }
        setHero(heroCard)

        // 관련 기사(출처 3개)
        let related: LatestItem[] = (first.relatedArticles ?? []).map((r) => ({
          id: r.id,
          press: r.press,
          title: r.title,
          summary: r.newsSummary,
          updatedAt: r.publishDate,
        }))

        // 폴백
        if (related.length === 0) {
          try {
            const rel = await axiosInstance.get(`/topic/${first.id}/related`, {
              params: { size: 6 },
            })
            const content = rel?.data?.result?.content ?? []
            related = (content as any[]).map((it) => ({
              id: it.id ?? it.topicId,
              press: it.press,
              title: it.title,
              summary: it.newsSummary,
              updatedAt: it.publishDate,
            }))
          } catch {
            /* ignore */
          }
        }
        setSources(related.slice(0, 3))

        // 그 외 다른 토픽들
        const rest = (raw?.items ?? []).slice(1).map((t) => ({
          id: t.id,
          press: t.imageSource?.press,
          title: t.topicName,
          summary: t.aiSummary,
          updatedAt: t.summaryTime,
          imageUrl: t.imageUrl,
          isSubscribed: t.isSubscribed ?? t.isSub ?? false,
        }))
        setOthers(rest)
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
  }, [])

  // 구독 ID 결정
  const subIdFor = (it?: LatestItem) => {
    if (SUBSCRIBE_SCOPE === 'article') return it?.id ?? topicId ?? 0
    return topicId ?? it?.id ?? 0
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1440px] pl-[160px] mx-auto">
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
              <div className="mb-2">
                <div className="mb-2">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="flex-1 min-w-0 font-semibold text-sm leading-snug truncate">
                      {hero.title ?? '제목'}
                    </span>
                    <div className="flex-shrink-0">
                      <SubscribeButton
                        id={subIdFor(hero)}
                        subscribe={hero.isSubscribed ?? false}
                        size="default"
                      />
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
                        <div className="text-xs text-gray-500 mt-1">
                          업데이트 {fmt(item.updatedAt)}
                        </div>
                      </div>

                      {/* 버튼 영역: 항상 우측 상단 고정 */}
                      <div className="row-span-2 self-start">
                        <SubscribeButton
                          id={subIdFor(item)}
                          subscribe={item.isSubscribed ?? false}
                          size="default"
                        />
                      </div>
                    </div>
                    <hr className="my-5 border-gray-300" />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
