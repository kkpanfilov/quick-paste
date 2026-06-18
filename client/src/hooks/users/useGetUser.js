import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => apiClient("GET", `users/${id}`),
  });
}
