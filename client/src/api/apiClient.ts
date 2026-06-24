import axios, { AxiosHeaders } from "axios";
import type { AxiosRequestConfig } from "axios";

import { getAccessToken, setAccessToken } from "@/shared/authStore.js";

import { refreshAccessToken } from "./auth/refreshAccessToken.ts";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiErrorMessage = {
  message: string;
  error: string;
  statusCode: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
      data,
      ...options,
    };

    const response = await axios<TResponse>(requestOptions);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorMessage>(error)) {
      if (error.response) {
        const errorData = error.response.data;

        if (!errorData) throw { message: "Response data is empty" };
        if (!errorData.message) throw { message: "Response message is empty" };

        const errorDataMessage = errorData.message;

        if (
          errorDataMessage === "Invalid access token" ||
          errorDataMessage === "Access token is missing"
        ) {
          console.log(
            "Access token is expired or invalid. Trying to refresh...",
          );

          const newToken = await refreshAccessToken();

          if (!newToken) throw { message: "Failed to refresh token" };

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
        throw { message: "No response from server" };
      } else {
        console.log("Request setup error:", error.message);
        throw { message: error.message || "Request failed" };
      }
    } else if (error instanceof Error) {
      console.log("Error:", error.message);
      throw { message: error.message };
    } else {
      console.log("Unknown error:", error);
      throw { message: "Unknown error" };
    }
  }
}
