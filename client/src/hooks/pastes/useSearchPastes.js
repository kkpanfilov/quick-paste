import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useSearchPastes(query, page = 1, options = {}) {
  const url = `pastes/search/${query}?page=${page}`;

  return useQuery({
    queryKey: [`search-pastes-${query}`, page],
    queryFn: () => apiClient("GET", url),
    ...options,
  });
}
