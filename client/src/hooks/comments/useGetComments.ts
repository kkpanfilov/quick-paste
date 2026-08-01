import { useInfiniteQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { CommentItem } from "@/types/comment.types.ts";

export type Cursor = string | null;

export type GetCommentsResult = {
  items: CommentItem[];
  nextCursor: Cursor | null;
};

export function useGetComments(pasteId: string) {
  return useInfiniteQuery({
    queryKey: [`paste-comments`, pasteId],
    queryFn: ({
      pageParam,
    }: {
      pageParam: Cursor | null;
    }): Promise<GetCommentsResult> => {
      const cursor = pageParam ? encodeURIComponent(pageParam) : "";

      return apiClient<GetCommentsResult>(
        "GET",
        `comments/${pasteId}${cursor ? `?cursor=${cursor}` : ""}`,
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });
}
