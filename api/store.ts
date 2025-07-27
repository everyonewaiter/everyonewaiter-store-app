import { axiosInstance } from '@/api/axios'
import { storageKeys } from '@/constants'
import { Setting, Store, StoreName } from '@/types'
import { getItem, makeSignatureHeader } from '@/utils'

export const getStoreNames = async (
  accountId: string,
): Promise<StoreName[]> => {
  const { data } = await axiosInstance.get(`/v1/stores/accounts/${accountId}`)
  return data.stores
}

export const getStore = async (): Promise<Store> => {
  const storeId = await getItem<string>(storageKeys.STORE_ID)
  const { data } = await axiosInstance.get(`/stores/${storeId}`)
  return data
}

export const getSetting = async (): Promise<Setting> => {
  const headers = await makeSignatureHeader()
  const { data } = await axiosInstance.get(`/settings`, { headers })
  return data
}
