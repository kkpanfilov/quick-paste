import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { FeedPasteItem } from "@/types/paste.types.ts";

type GetSearchPastesResult = {
  items: FeedPasteItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    totalMatches: number;
  };
};

type UseGetSearchPastesOptions = Omit<
  UseQueryOptions<GetSearchPastesResult>,
  "queryKey" | "queryFn" | "select"
>;

export function useSearchPastes(
  query: string,
  page: number = 1,
  options: UseGetSearchPastesOptions = {},
) {
  const url = `pastes/search/${query}?page=${page}`;

  return useQuery({
    queryKey: [`search-pastes-${query}`, page],
    queryFn: (): Promise<GetSearchPastesResult> =>
      apiClient<GetSearchPastesResult>("GET", url),
    ...options,
  });
}
