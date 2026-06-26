import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { CreateReplyDto, ReplyItem } from "@/types/reply.types.ts";

type CreateReplyType = {
  id: string;
  pasteId: string;
  data: CreateReplyDto;
};

export function useCreateReply() {
  return useMutation({
    mutationFn: ({ id, pasteId, data }: CreateReplyType): Promise<ReplyItem> =>
      apiClient<ReplyItem, CreateReplyDto>("POST", `comments/${id}/reply`, {
        ...data,
        pasteId,
      }),
  });
}
