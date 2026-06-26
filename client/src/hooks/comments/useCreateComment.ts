import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { CommentItem, CreateCommentDto } from "@/types/comment.types.ts";

type CreateCommentType = {
  pasteId: string;
  body: CreateCommentDto;
};

export function useCreateComment() {
  return useMutation({
    mutationFn: ({ pasteId, body }: CreateCommentType): Promise<CommentItem> =>
      apiClient<CommentItem, CreateCommentDto>(
        "POST",
        `comments/${pasteId}`,
        body,
      ),
  });
}
