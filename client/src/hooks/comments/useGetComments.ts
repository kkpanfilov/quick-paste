import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { CommentItem } from "@/types/comment.types.ts";

type GetCommentsResult = {
  id: string;
  data: CommentItem[];
};

export function useGetComments(pasteId: string) {
  return useQuery({
    queryKey: ["paste_comments", pasteId],
    queryFn: (): Promise<GetCommentsResult> =>
      apiClient<GetCommentsResult>("GET", `comments/${pasteId}`),
  });
}
