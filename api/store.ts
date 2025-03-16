import { axiosInstance } from '@/api/axios'
import { storageKeys } from '@/constants'
import { Store, StoreName } from '@/types'
import { getItem } from '@/utils'

export const getStoreNames = async (userId: bigint): Promise<StoreName[]> => {
  const { data } = await axiosInstance.get(`/users/${userId}/stores`)
  return data.stores
}

export const getStore = async (): Promise<Store> => {
  const storeId = await getItem<string>(storageKeys.STORE_ID)
  const { data } = await axiosInstance.get(`/stores/${storeId}`)
  return data
}
