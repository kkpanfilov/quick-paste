import axios from "axios";

const BASE_URL = "http://localhost:4200";

let refreshPromise = null;

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = requestRefreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function requestRefreshAccessToken() {
  const response = await axios.post(`${BASE_URL}/api/auth/refresh`, null, {
    withCredentials: true,
  });

  const data = response.data;

  if (!data?.accessToken) {
    throw new Error("Failed to refresh access token");
  }

  return data;
}
