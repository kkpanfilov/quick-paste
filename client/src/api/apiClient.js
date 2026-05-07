import axios from "axios";

import { getAccessToken } from "@/shared/authStore.js";

const BASE_URL = "http://localhost:4200";
const PREFIX = "/api";

// TODO: добавить refresh при необходимости
export async function apiClient(method, endpoint, data = null, options = {}) {
  try {
    const accessToken = getAccessToken();

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

    if (accessToken) {
      requestOptions.headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios(requestOptions);

    if (response) return response.data;
  } catch (error) {
    console.log(error);
  }
}

// async function refreshToken() {}
