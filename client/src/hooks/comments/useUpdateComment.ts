import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { CommentItem, UpdateCommentDto } from "@/types/comment.types.ts";
import type { ReplyItem } from "@/types/reply.types.ts";

type UpdateCommentOptions = {
  id: string;
  body: UpdateCommentDto;
};

export function useUpdateComment() {
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: UpdateCommentOptions): Promise<CommentItem | ReplyItem> =>
      apiClient<CommentItem | ReplyItem>("PATCH", `comments/${id}`, body),
  });
}
