import { axiosInstance } from '@/api/axios'
import { storageKeys } from '@/constants'
import { Category, ImageAccessUri, Menu } from '@/types'
import { getItemOrElseThrow } from '@/utils'

export const getCategories = async (): Promise<Category[]> => {
  const storeId = await getItemOrElseThrow<string>(storageKeys.STORE_ID)
  const { data } = await axiosInstance.get(`/stores/${storeId}/categories`)
  return data.categories
}

export const getMenus = async (): Promise<Menu[]> => {
  const storeId = await getItemOrElseThrow<string>(storageKeys.STORE_ID)
  const { data } = await axiosInstance.get(`/stores/${storeId}/menus`)
  return data.menus
}

export const getMenuImage = async (
  imageId: bigint,
): Promise<ImageAccessUri> => {
  const { data } = await axiosInstance.get(`/images/${imageId}`)
  return data
}
