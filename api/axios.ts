import axios from 'axios'
import JSONBig from 'json-bigint'

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ko',
  },
  withCredentials: true,
  transformRequest: data => JSONBig.stringify(data),
  transformResponse: data => (data ? JSONBig.parse(data) : data),
})
