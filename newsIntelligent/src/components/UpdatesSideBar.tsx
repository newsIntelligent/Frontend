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

/** 서버 응답 타입(스웨거 스키마 기준) */
type LatestApiResult = {
  id: number
  topicName: string
  aiSummary?: string
  imageUrl?: string
  summaryTime?: string
  imageSource?: { press?: string; title?: string }
  isSubscribed?: boolean
  relatedArticles?: Array<{
    id: number
    press?: string
    title?: string
    publishDate?: string
    newsSummary?: string
  }>
}

/** 날짜 포맷 */
const fmt = (iso?: string) => {
  if (!iso) return '-'
  const d = new Date(iso)
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function UpdatesSidebar() {
  const [items, setItems] = useState<LatestItem[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [topicId, setTopicId] = useState<number | null>(null) // 대표 토픽 id 저장(구독용)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setErr(null)

        // 실제 API 호출 ─ baseURL이 .../api 라면 '/topic/latest' 그대로 사용
        const { data } = await axiosInstance.get('/topic/latest')
        const result: LatestApiResult | undefined = data?.result
        if (!result) {
          setItems([])
          setTopicId(null)
          return
        }
        setTopicId(result.id)

        // 대표 카드
        const hero: LatestItem = {
          id: result.id,
          press: result.imageSource?.press ?? '이미지',
          title: result.topicName,
          summary: result.aiSummary,
          updatedAt: result.summaryTime,
          imageUrl: result.imageUrl ?? '/src/assets/stk.jpg',
          isSubscribed: result.isSubscribed ?? false,
        }

        // 관련 기사 목록
        const rest: LatestItem[] = (result.relatedArticles ?? []).map((r) => ({
          id: r.id,
          press: r.press,
          title: r.title,
          summary: r.newsSummary,
          updatedAt: r.publishDate,
        }))

        setItems([hero, ...rest])
      } catch (e: any) {
        const code = e?.response?.status
        if (code === 404) setItems([])
        else if (code === 401 || code === 403) setErr('인증이 필요합니다.')
        else setErr('목록을 불러오지 못했어요.')
        setTopicId(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hero = items[0]
  const list3 = useMemo(() => items.slice(1, 4), [items])
  const bottom = useMemo(() => items.slice(4, 7), [items])

  // 구독에 넘길 ID 결정(토픽/기사)
  const subIdFor = (it?: LatestItem) => {
    if (SUBSCRIBE_SCOPE === 'article') return it?.id ?? topicId ?? 0
    return topicId ?? it?.id ?? 0 // 기본은 대표 토픽 id
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1440px] pl-[160px] mx-auto">
        <aside className="sticky top-[10px] w-[320px]">
          <div className="border-t-2 px-4 py-5 h-full">
            <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-3">최신수정보도</h2>

            {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
            {err && <p className="text-sm text-red-500">{err}</p>}
            {!loading && !err && items.length === 0 && (
              <div className="my-6 text-sm text-gray-500">최신 수정 보도가 아직 없어요.</div>
            )}

            {/* 대표 카드 */}
            {!loading && !err && hero && (
              <div className="mb-5">
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{hero.title ?? '제목'}</span>
                    <SubscribeButton
                      id={subIdFor(hero)}
                      subscribe={hero.isSubscribed ?? false}
                      size="default"
                    />
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
                  <p className="text-sm text-gray-800 leading-snug mb-3">
                    {hero.summary ?? hero.title ?? ''}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 mt-2 leading-tight mb-3">
                  이미지 · {hero.press ?? '-'}
                </p>
              </div>
            )}

            {!loading && !err && items.length > 0 && <hr className="my-5 border-gray-300" />}

            {/* 중간 3개 */}
            {!loading && !err && list3.length > 0 && (
              <ul className="space-y-5 mb-8">
                {list3.map((it, i) => (
                  <li
                    key={`${it.id}-${it.title}-${i}`}
                    className="flex gap-2 items-start text-xs leading-snug"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-[5px] ${i === 2 ? 'bg-gray-400' : 'bg-sky-500'}`}
                    />
                    <div className="flex flex-col flex-1">
                      <span className="text-[11px] text-gray-500 mb-0.5">
                        {it.press ?? '-'} · {fmt(it.updatedAt)}
                      </span>
                      <span className="text-gray-800">{it.title}</span>
                    </div>
                    <SubscribeButton id={subIdFor(it)} subscribe={false} size="default" />
                  </li>
                ))}
              </ul>
            )}

            {!loading && !err && items.length > 1 && <hr className="my-5 border-gray-300" />}

            {/* 하단 3개 */}
            {!loading && !err && bottom.length > 0 && (
              <div className="text-sm">
                {bottom.map((item, idx) => {
                  const title = item.title ?? ''
                  const isTitleLong = title.length > 20
                  return (
                    <React.Fragment key={`${item.id}-${title}-${idx}`}>
                      <div className="flex justify-between items-start gap-3">
                        {isTitleLong ? (
                          <div className="flex flex-col">
                            <span className="font-medium leading-tight">{title}</span>
                            <span className="text-xs text-gray-500">
                              업데이트 {fmt(item.updatedAt)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium leading-tight">{title}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              업데이트 {fmt(item.updatedAt)}
                            </span>
                          </div>
                        )}
                        <SubscribeButton id={subIdFor(item)} subscribe={false} size="default" />
                      </div>
                      <hr className="my-5 border-gray-300" />
                    </React.Fragment>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
