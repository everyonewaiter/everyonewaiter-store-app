import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "ko",
  },
  withCredentials: true,
  transformRequest: (data) => JSON.stringify(data),
  transformResponse: (data) => (data ? JSON.parse(data) : data),
});
