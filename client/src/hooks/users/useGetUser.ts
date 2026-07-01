import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { User } from "@/types/user.types.ts";

export function useGetUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: (): Promise<User> => apiClient<User>("GET", `users/${id}`),
  });
}
