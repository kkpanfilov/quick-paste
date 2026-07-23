import { useInfiniteQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { ISODateString } from "@/types/common.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

export type Cursor = {
  createdAt: ISODateString;
  id: string;
} | null;

export type GetRepliesResult = {
  items: ReplyItem[];
  nextCursor: Cursor | null;
};

type Options = {
  enabled: boolean;
};

export function useGetReplies(
  pasteId: string,
  commentId: string,
  options: Options = { enabled: false },
) {
  return useInfiniteQuery({
    queryKey: [`comments-replies`, commentId],
    queryFn: ({
      pageParam,
    }: {
      pageParam: Cursor | null;
    }): Promise<GetRepliesResult> => {
      const cursor = pageParam
        ? encodeURIComponent(JSON.stringify(pageParam))
        : "";

      return apiClient<GetRepliesResult>(
        "GET",
        `comments/${pasteId}/replies/${commentId}${cursor ? `?cursor=${cursor}` : ""}`,
      );
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    enabled: options.enabled,
  });
}
