import { axiosInstance } from '@/api/axios'
import { Order, OrderCreate } from '@/types'
import { makeSignatureHeader } from '@/utils'

type CreateStaffCallRequest = {
  callOption: string
}

export const createStaffCall = async ({
  ...requestBody
}: CreateStaffCallRequest): Promise<void> => {
  const headers = await makeSignatureHeader()
  return await axiosInstance.post(`/staff/call`, requestBody, { headers })
}

type CreateTableOrderRequest = {
  menus: OrderCreate[]
}

export const createTableOrder = async ({
  ...requestBody
}: CreateTableOrderRequest) => {
  const headers = await makeSignatureHeader()
  return await axiosInstance.post(`/orders/table`, requestBody, { headers })
}

export const getTableOrderHistories = async (): Promise<Order[]> => {
  const headers = await makeSignatureHeader()
  const { data } = await axiosInstance.get(`/orders/table`, { headers })
  return data.orders
}
