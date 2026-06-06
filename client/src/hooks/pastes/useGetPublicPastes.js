import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetPublicPaste(page = 1, options = {}) {
  const url = `pastes/public?page=${page}`;

  return useQuery({
    queryKey: ["public-pastes", page],
    queryFn: () => apiClient("GET", url),
    ...options,
  });
}
