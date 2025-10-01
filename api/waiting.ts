import { axiosInstance } from "@/api/axios";
import { CreateWaitingRequest, WaitingCount } from "@/types/waiting";
import { makeSignatureHeader } from "@/utils/common";

export const getWaitingCount = async (): Promise<WaitingCount> => {
  const requestMethod = "GET";
  const requestURI = `/v1/waitings/count`;
  const headers = await makeSignatureHeader(requestMethod, requestURI);
  const { data } = await axiosInstance.get(requestURI, { headers });
  return data;
};

export const createWaiting = async ({ ...requestBody }: CreateWaitingRequest): Promise<void> => {
  const requestMethod = "POST";
  const requestURI = `/v1/waitings`;
  const headers = await makeSignatureHeader(requestMethod, requestURI);
  return await axiosInstance.post(requestURI, requestBody, { headers });
};
