import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";

type UnlikePasteResult = {
  id: string;
  isLiked: boolean;
  likesCount: number;
};

export function useUnlikePaste() {
  return useMutation({
    mutationFn: (id: string): Promise<UnlikePasteResult> =>
      apiClient<UnlikePasteResult>("POST", `pastes/${id}/unlike`),
  });
}
