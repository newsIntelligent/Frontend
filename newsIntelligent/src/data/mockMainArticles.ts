export const mockMainArticles = {
  isSuccess: true,
  code: "MAIN200",
  status: "OK",
  message: "성공입니다.",
  result: {
    content: Array.from({ length: 30 }, (_, i) => ({
      id: 30 - i,
      title: `테스트 기사 ${30 - i}번`,
      content: `이것은 테스트 기사 ${30 - i}의 본문입니다. 무한스크롤 테스트를 위해 생성된 더미 데이터입니다.`,
      imageUrl: "",
      imageSource: `뉴스 소스 ${30 - i}`,
      idSub: Math.random() > 0.5,
      createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    })),
    totalCount: 30,
    lastId: 1,
    size: 5,
    hasNext: true
  }
};