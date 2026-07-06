import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig } from "axios";

import { getAccessToken, setAccessToken } from "@/shared/authStore.ts";

import { refreshAccessToken } from "./auth/refreshAccessToken.ts";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiError = {
  message: string;
  error: string;
  statusCode: number;
};

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "error" in error &&
    "statusCode" in error &&
    typeof error.message === "string" &&
    typeof error.error === "string" &&
    typeof error.statusCode === "number"
  );
}

function createApiError(
  message: string,
  error: string,
  statusCode: number,
): ApiError {
  return {
    message,
    error,
    statusCode,
  };
}

const API_BASE_URL = "/api";

export async function apiClient<TResponse, TBody = unknown>(
  method: HttpMethod,
  endpoint: string,
  data?: TBody,
  options?: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  try {
    const accessToken = getAccessToken();

    const headers = new AxiosHeaders();

    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const requestOptions: AxiosRequestConfig<TBody> = {
      method,
      withCredentials: true,
      headers,
      baseURL: API_BASE_URL,
      url: endpoint,
      ...(data !== undefined ? { data } : {}),
      ...options,
    };

    const response = await axios<TResponse>(requestOptions);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiError>(error)) {
      if (error.response) {
        const errorData = error.response.data;

        if (!isApiError(errorData)) {
          throw createApiError(
            "Invalid API error response",
            "Invalid API Error",
            error.response.status,
          );
        }

        const errorDataMessage = errorData.message;

        if (
          errorDataMessage === "Invalid access token" ||
          errorDataMessage === "Access token is missing"
        ) {
          console.log(
            "Access token is expired or invalid. Trying to refresh...",
          );

          const newToken = await refreshAccessToken();

          if (!newToken) {
            throw createApiError(
              "Failed to refresh token",
              "Authentication Error",
              401,
            );
          }

          setAccessToken(newToken.accessToken);

          console.log("Successfully refreshed token");

          return apiClient<TResponse, TBody>(method, endpoint, data, options);
        }

        if (
          errorDataMessage === "Invalid refresh token" ||
          errorDataMessage === "Refresh token not found"
        ) {
          console.log("Invalid refresh token, please sign in again");
        }

        throw error.response.data;
      } else if (error.request) {
        console.log("No response from server");
        throw createApiError("No response from server", "Network Error", 0);
      } else {
        console.log("Request setup error:", error.message);
        throw createApiError(
          error.message || "Request failed",
          "Request Error",
          0,
        );
      }
    } else if (error instanceof Error) {
      console.log("Error:", error.message);
      throw createApiError(error.message, "Client Error", 0);
    } else {
      console.log("Unknown error:", error);
      throw createApiError("Unknown error", "Unknown Error", 0);
    }
  }
}
