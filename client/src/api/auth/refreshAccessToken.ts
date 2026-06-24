import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

type RefreshAccessTokenResponse = {
  id: string;
  accessToken: string;
};

let refreshPromise: Promise<RefreshAccessTokenResponse | null> | null = null;

export function refreshAccessToken(): Promise<RefreshAccessTokenResponse | null> {
  if (!refreshPromise) {
    refreshPromise = requestRefreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function requestRefreshAccessToken(): Promise<RefreshAccessTokenResponse | null> {
  try {
    console.log("Refreshing access token...");

    const { data } = await axios.post<RefreshAccessTokenResponse>(
      `${API_BASE_URL}/auth/refresh`,
      null,
      {
        withCredentials: true,
      },
    );

    if (!data) return null;
    if (!data.id || !data.accessToken) return null;

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("Server responded with error:", error.response.status);
        console.log(error.response.data);
      } else if (error.request) {
        console.log("No response from server");
      } else {
        console.log("Request setup error:", error.message);
      }
    } else {
      console.log("Unknown error:", error);
    }

    return null;
  }
}
