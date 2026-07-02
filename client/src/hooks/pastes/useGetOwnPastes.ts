import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { FeedPasteItem } from "@/types/paste.types.ts";

type GetOwnPastesResult = {
  items: FeedPasteItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

type UseGetOwnPastesOptions = Omit<
  UseQueryOptions<GetOwnPastesResult>,
  "queryKey" | "queryFn" | "select"
>;

export function useGetOwnPastes(
  page: number = 1,
  options: UseGetOwnPastesOptions = {},
) {
  const url = `pastes/me?page=${page}`;

  return useQuery({
    queryKey: ["own-pastes", page],
    queryFn: () => apiClient<GetOwnPastesResult>("GET", url),
    ...options,
  });
}
