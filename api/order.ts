import { axiosInstance } from "@/api/axios";
import { CreateStaffCallRequest, CreateTableOrderRequest, Order } from "@/types/order";
import { makeSignatureHeader } from "@/utils/support";

export const createStaffCall = async ({
  ...requestBody
}: CreateStaffCallRequest): Promise<void> => {
  const requestMethod = "POST";
  const requestURI = `/v1/orders/staff-calls`;
  const headers = await makeSignatureHeader(requestMethod, requestURI);
  return await axiosInstance.post(requestURI, requestBody, { headers });
};

export const createTableOrder = async ({ ...requestBody }: CreateTableOrderRequest) => {
  const requestMethod = "POST";
  const requestURI = `/v1/orders`;
  const headers = await makeSignatureHeader(requestMethod, requestURI);
  return await axiosInstance.post(requestURI, requestBody, { headers });
};

export const getTableOrderHistories = async (): Promise<Order[]> => {
  const requestMethod = "GET";
  const requestURI = `/v1/orders/tables`;
  const headers = await makeSignatureHeader(requestMethod, requestURI);
  const { data } = await axiosInstance.get(requestURI, { headers });
  return data.orders;
};
