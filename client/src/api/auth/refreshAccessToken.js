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
  try {
    console.log("Refreshing access token...");

    const response = await axios.post(`${BASE_URL}/api/auth/refresh`, null, {
      withCredentials: true,
    });

    const data = response.data;

    if (!data?.accessToken) {
      return null;
    }

    return data;
  } catch (error) {
    if (error.response) {
      console.log("Server responded with error:", error.response.status);
      console.log(error.response.data);
    } else if (error.request) {
      console.log("No response from server");
    } else {
      console.log("Request setup error:", error.message);
    }
  }
}
