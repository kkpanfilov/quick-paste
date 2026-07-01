import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { FeedPasteItem } from "@/types/paste.types.ts";

type GetPublicPastesResult = {
  items: FeedPasteItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

type UseGetPublicPastesOptions = Omit<
  UseQueryOptions<GetPublicPastesResult>,
  "queryKey" | "queryFn" | "select"
>;

export function useGetPublicPaste(
  page: number = 1,
  options: UseGetPublicPastesOptions = {},
) {
  const url = `pastes/public?page=${page}`;

  return useQuery({
    queryKey: ["public-pastes", page],
    queryFn: (): Promise<GetPublicPastesResult> =>
      apiClient<GetPublicPastesResult>("GET", url),
    ...options,
  });
}
