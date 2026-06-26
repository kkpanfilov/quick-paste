import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

type DeletePasteResult = {
  id: string;
};

export function useDeletePaste() {
  return useMutation({
    mutationFn: (id: string): Promise<DeletePasteResult> =>
      apiClient<DeletePasteResult>("DELETE", `pastes/${id}`),
  });
}
