import { axiosInstance } from '@/api/axios'
import { StoreName } from '@/types'

export const getStoreNames = async (userId: bigint): Promise<StoreName[]> => {
  const { data } = await axiosInstance.get(`/users/${userId}/stores`)
  return data.stores
}
