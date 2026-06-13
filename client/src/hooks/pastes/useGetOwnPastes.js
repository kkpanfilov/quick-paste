import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetOwnPaste(page = 1, options = {}) {
  const url = `pastes/me?page=${page}`;

  return useQuery({
    queryKey: ["own-pastes", page],
    queryFn: () => apiClient("GET", url),
    ...options,
  });
}
