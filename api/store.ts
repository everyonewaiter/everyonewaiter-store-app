import { axiosInstance } from '@/api/axios'
import { Store, StoreName } from '@/types'

export const getStoreNames = async (
  accountId: string,
): Promise<StoreName[]> => {
  const { data } = await axiosInstance.get(`/v1/stores/accounts/${accountId}`)
  return data.stores
}

export const getStore = async (storeId: string): Promise<Store> => {
  const { data } = await axiosInstance.get(`/v1/stores/${storeId}`)
  return data
}
