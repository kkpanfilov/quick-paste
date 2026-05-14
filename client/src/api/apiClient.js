import axios from "axios";

import { getAccessToken, setAccessToken } from "@/shared/authStore.js";

import { refreshAccessToken } from "./auth/refreshAccessToken.js";

const BASE_URL = "http://localhost:4200";
const PREFIX = "/api";

export async function apiClient(method, endpoint, data = {}, options = {}) {
  try {
    let accessToken = getAccessToken();

    const requestOptions = {
      method,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      baseURL: BASE_URL,
      url: `${PREFIX}/${endpoint}`,
      data: data,
      ...options,
    };

    if (accessToken)
      requestOptions.headers.Authorization = `Bearer ${accessToken}`;

    const response = await axios(requestOptions);

    return response.data;
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data;
      const errorDataMessage = errorData.message;

      if (
        errorDataMessage === "Invalid access token" ||
        errorDataMessage === "Access token is missing"
      ) {
        console.log("Access token is expired or invalid. Trying to refresh...");

        const newToken = await refreshAccessToken();

        if (!newToken) return;

        setAccessToken(newToken.accessToken);

        console.log("Successfully refreshed token");

        return apiClient(method, endpoint, data, options);
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
  }
}
