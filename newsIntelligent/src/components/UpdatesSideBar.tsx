import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../api/axios'
/** ───────────── 설정 ───────────── */
const USE_DUMMY = true // ← 실제 API로 보려면 false로 바꿔

// // Access Token 하드코딩 (테스트용)
// const token =
//   'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlNzQwNWE1My1kZDVkLTQ1OTctODc1Ny1hMmRiYTQ5NmM1MGYiLCJzdWIiOiJoZWVqdW5nX184MTE0QG5hdmVyLmNvbSIsImlkIjo2LCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzU1MTkyMjc5LCJleHAiOjE3NTUyMDY2Nzl9.QowigKFmDL5phMhA9aEoIXQZjM_f91mhZhAbPWWxNq0'

// /** 이 컴포넌트 전용 axios 인스턴스 (전역 axiosInstance 건드리지 않음) */
// const latestApi = axiosInstance.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL, // 예: https://api.newsintelligent.site/api
//   headers: { Authorization: `Bearer ${token}` },
// })

/** ───────────── 타입 ───────────── */
type LatestItem = {
  press?: string
  title?: string
  updatedAt?: string
  imageUrl?: string
  summary?: string
}

/** 성공 스키마 더미 (result + relatedArticles) */
const latestDummy = {
  id: 101,
  title: '국내 첫 양자컴퓨터 실험 성공',
  newsSummary: '국내 연구진이 양자컴퓨터 시뮬레이션에서 세계 최고 성능을 달성했습니다.',
  publishDate: '2025-08-14T12:36:56.465Z',
  relatedArticles: [
    {
      id: 201,
      press: '연합뉴스',
      title: '양자컴퓨터, 인공지능과 결합 가능성 주목',
      newsSummary: 'AI와 양자컴퓨터의 융합 연구가 빠르게 진행 중입니다.',
      newLink: 'https://example.com/article1',
      publishDate: '2025-08-14T13:10:00.000Z',
    },
    {
      id: 202,
      press: '조선일보',
      title: '정부, 양자기술 지원 계획 발표',
      newsSummary: '향후 5년간 양자기술 개발에 1조 원 투자 계획을 발표했습니다.',
      newLink: 'https://example.com/article2',
      publishDate: '2025-08-14T14:00:00.000Z',
    },
    {
      id: 203,
      press: '한겨레',
      title: '양자기술 인력 양성 본격화',
      newsSummary: '대학과 연구기관 중심의 인력 양성 프로그램이 시행됩니다.',
      newLink: 'https://example.com/article3',
      publishDate: '2025-08-14T15:30:00.000Z',
    },
    {
      id: 204,
      press: '경향신문',
      title: '국제 공동 연구로 양자컴퓨터 개발 가속화',
      newsSummary: '국제 공동 연구 네트워크가 구축됩니다.',
      newLink: 'https://example.com/article4',
      publishDate: '2025-08-14T16:15:00.000Z',
    },
    {
      id: 205,
      press: '매일경제',
      title: '양자통신 실험 성공, 보안 혁신 기대',
      newsSummary: '양자 암호 기술을 이용한 통신 실험에 성공했습니다.',
      newLink: 'https://example.com/article5',
      publishDate: '2025-08-14T17:00:00.000Z',
    },
    {
      id: 206,
      press: 'KBS 뉴스',
      title: '양자컴퓨터가 바꿀 미래 산업 지형',
      newsSummary: '양자컴퓨터의 상용화가 가져올 산업 변화 전망',
      newLink: 'https://example.com/article6',
      publishDate: '2025-08-14T17:45:00.000Z',
    },
  ],
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

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setErr(null)

        if (USE_DUMMY) {
          // 성공 스키마(result + relatedArticles)를 기존 items 배열로 변환
          const hero: LatestItem = {
            press: latestDummy.relatedArticles[0]?.press ?? '이미지',
            title: latestDummy.title,
            summary: latestDummy.newsSummary,
            updatedAt: latestDummy.publishDate,
            imageUrl: '/src/assets/stk.jpg',
          }
          const rest: LatestItem[] = latestDummy.relatedArticles.map((r) => ({
            press: r.press,
            title: r.title,
            summary: r.newsSummary,
            updatedAt: r.publishDate,
          }))
          setItems([hero, ...rest])
          return
        }

        // 실제 API 호출 (성공 스키마 기준)
        const { data } = await axiosInstance.get('/topic/latest')
        const result = data?.result
        if (!result) {
          setItems([])
          return
        }
        const hero: LatestItem = {
          press: result?.relatedArticles?.[0]?.press ?? '이미지',
          title: result?.title,
          summary: result?.newsSummary,
          updatedAt: result?.publishDate,
          imageUrl: '/src/assets/stk.jpg',
        }
        const rest: LatestItem[] = (result?.relatedArticles ?? []).map((r: any) => ({
          press: r.press,
          title: r.title,
          summary: r.newsSummary,
          updatedAt: r.publishDate,
        }))
        setItems([hero, ...rest])
      } catch (e: any) {
        const code = e?.response?.status
        if (code === 404) {
          setItems([]) // 데이터 없음(비즈니스 404)
        } else if (code === 401 || code === 403) {
          setErr('인증이 필요합니다.')
        } else {
          setErr('목록을 불러오지 못했어요.')
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hero = items[0]
  const list3 = items.slice(1, 4) // 중간 목록 3개
  const bottom = items.slice(4, 7) // 하단 3개

  return (
    // 이 div는 전체 페이지 중앙에 위치합니다.
    <div className="w-full flex justify-center">
      {/* 이 div는 헤더의 내부 컨테이너와 동일한 1440px 너비를 가집니다. */}
      <div className="w-[1440px] pl-[160px] mx-auto">
        <aside className="sticky top-[10px] w-[320px] h-[calc(100vh-167px)] overflow-y-auto">
          <div className="border-t-2 px-4 py-5 h-full">
            {/* 제목 */}
            <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-3">최신수정보도</h2>

            {/* 상태 */}
            {loading && <p className="text-sm text-gray-500">불러오는 중…</p>}
            {err && <p className="text-sm text-red-500">{err}</p>}
            {!loading && !err && items.length === 0 && (
              <div className="my-6 text-sm text-gray-500">최신 수정 보도가 아직 없어요.</div>
            )}

            {/* 대표 뉴스 카드 */}
            {!loading && !err && hero && (
              <div className="mb-5">
                <div className="mb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{hero.title ?? '제목'}</span>
                    <img
                      src="/src/assets/subscribe.svg"
                      alt="구독 버튼"
                      className="w-[52px] h-[24px]"
                    />
                  </div>
                  <span className="text-xs text-gray-500">업데이트 {fmt(hero.updatedAt)}</span>
                </div>

                <div className="flex gap-3 mb-2 items-start">
                  <img
                    src={hero.imageUrl ?? '/src/assets/stk.jpg'}
                    alt="뉴스 이미지"
                    className="w-[96px] h-[60px] object-cover rounded"
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

            {/* 중간 목록 3개 */}
            {!loading && !err && list3.length > 0 && (
              <ul className="space-y-5 mb-8">
                {list3.map((it, i) => (
                  <li
                    key={`${it.title}-${i}`}
                    className="flex gap-2 items-start text-xs leading-snug"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-[5px] ${i === 2 ? 'bg-gray-400' : 'bg-sky-500'}`}
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] text-gray-500 mb-0.5">
                        {it.press ?? '-'} · {fmt(it.updatedAt)}
                      </span>
                      <span className="text-gray-800">{it.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {!loading && !err && items.length > 1 && <hr className="my-5 border-gray-300" />}

            {/* 하단 3개 타일 */}
            {!loading && !err && bottom.length > 0 && (
              <div className="text-sm">
                {bottom.map((item, idx) => {
                  const title = item.title ?? ''
                  const isTitleLong = title.length > 20
                  return (
                    <React.Fragment key={`${title}-${idx}`}>
                      <div className="flex justify-between items-start">
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
                        <img
                          src="/src/assets/subscribe.svg"
                          alt="구독"
                          className="w-[52px] h-[24px]"
                        />
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
