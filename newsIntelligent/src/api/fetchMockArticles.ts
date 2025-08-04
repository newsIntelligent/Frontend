import { mockMainArticles } from "../data/mockMainArticles";

const PAGE_SIZE = 5;

export const fetchMockArticles = async ({ pageParam = 1 }) => {
  const start = (pageParam - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const sliced = mockMainArticles.result.content.slice(start, end);

  return {
    articles: sliced,
    nextPage: end < mockMainArticles.result.content.length ? pageParam + 1 : undefined,
  };
};