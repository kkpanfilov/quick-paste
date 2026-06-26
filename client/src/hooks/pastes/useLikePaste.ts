import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

type LikePasteResult = {
  id: string;
  isLiked: boolean;
  likesCount: number;
};

export function useLikePaste() {
  return useMutation({
    mutationFn: (id: string): Promise<LikePasteResult> =>
      apiClient<LikePasteResult>("POST", `pastes/${id}/like`),
  });
}
