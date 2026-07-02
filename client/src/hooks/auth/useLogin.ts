import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { LoginDto, LoginResponse } from "@/types/auth.types.ts";

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginDto): Promise<LoginResponse> =>
      apiClient<LoginResponse, LoginDto>("POST", "auth/login", body),
  });
}
