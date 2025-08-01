import React, { useEffect, useState } from "react";

const UpdatesSidebar = () => {
  return (
    // 이 div는 전체 페이지 중앙에 위치합니다.
    <div className="w-full flex justify-center">
      {/* 이 div는 헤더의 내부 컨테이너와 동일한 1440px 너비를 가집니다.
          여기에 pl-[104px]를 직접 적용하여 사이드바의 시작 위치를 헤더의 홈 버튼과 맞춰줌 */}
      <div className="w-[1440px] pl-[160px] mx-auto">
        <aside
          className={`sticky top-[10px] w-[320px]  h-[calc(100vh-167px)] overflow-y-auto `}
        >
          <div
            className={`border-t-2 px-4 py-5 h-full
          `}
          >
            {/* 제목 */}
            <h2 className="text-xl font-bold mb-2 border-b border-gray-300  pb-3">
              최신수정보도
            </h2>

            {/* 대표 뉴스 카드 */}
            <div className="mb-5">
              <div className="mb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">
                    코인 수수료 1.11%에서 1.42%으로 상승했습니다.
                  </span>
                  <img
                    src="/src/assets/subscribe.svg"
                    alt="구독 버튼"
                    className="w-[52px] h-[24px]"
                  />
                </div>
                <span className="text-xs text-gray-500 ">
                  업데이트 05/03 23:50
                </span>
              </div>

              <div className="flex gap-3 mb-2 items-start">
                <img
                  src="/src/assets/stk.jpg"
                  alt="뉴스 이미지"
                  className="w-[96px] h-[60px] object-cover rounded"
                />
                <p className="text-sm text-gray-800 leading-snug mb-3">
                  규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로
                  이어질 우려가 제기되었습니다.
                </p>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 leading-tight mb-3">
                이미지 · 조선일보 “고양이가 크게 우는 이유, 유전자에 숨겨져
                있을지도…”
              </p>
            </div>

            <hr className="my-5 border-gray-300" />

            {/* 연합뉴스 목록 */}
            <ul className="space-y-5 mb-8">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="flex gap-2 items-start text-xs leading-snug"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-[5px] ${
                      i === 2 ? "bg-gray-400" : "bg-sky-500"
                    }`}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 mb-0.5">
                      연합뉴스 · 05/0{3 + i} 03:55
                    </span>
                    <span className="text-gray-800">
                      규모의 유심(USIM) 관련 정보가 유출되었습니다. 2차 범죄로
                      이어질 우려가 있{i === 2 ? "겠습니…" : "습니다."}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <hr className="my-5 border-gray-300" />

            <div className="text-sm">
              {[
                { title: "SKT유심", time: "05/03 23:50" },
                { title: "이재명 정부 출범", time: "05/03 23:50" },
                {
                  title: "북디자인 교과서, 현대 디자인의 이해한다",
                  time: "05/03 23:50",
                },
              ].map((item, idx) => {
                const isTitleLong = item.title.length > 20; // 기준값은 조절 가능

                return (
                  <React.Fragment key={idx}>
                    <div className="flex justify-between items-start">
                      {isTitleLong ? (
                        // 긴 제목이면 줄바꿈 구조
                        <div className="flex flex-col">
                          <span className="font-medium leading-tight">
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            업데이트 {item.time}
                          </span>
                        </div>
                      ) : (
                        // 짧은 제목이면 인라인 구조
                        <div className="flex items-center gap-2">
                          <span className="font-medium leading-tight">
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            업데이트 {item.time}
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
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UpdatesSidebar;
