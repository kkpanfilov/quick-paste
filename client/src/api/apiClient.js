import axios from "axios";

import { getAccessToken } from "@/shared/authStore.js";

const PREFIX = "/api";

export async function apiClient(method, endpoint, data = null, options = {}) {
  const accessToken = getAccessToken();

  const requestOptions = {
    method,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    url: `${PREFIX}/${endpoint}`,
    data: data,
    ...options,
  };

  if (accessToken) {
    requestOptions.headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await axios(requestOptions);

  if (response.status >= 400) {
    throw new Error(response.data.message);
  }

  return response.data;
}
