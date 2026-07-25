import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { Message } from "@/types/common.types.ts";

type DeleteCommentResult = Message;

export function useDeleteComment() {
  return useMutation({
    mutationFn: (id: string): Promise<DeleteCommentResult> =>
      apiClient<DeleteCommentResult>("DELETE", `comments/${id}`),
  });
}
