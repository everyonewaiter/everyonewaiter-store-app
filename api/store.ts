import { axiosInstance } from '@/api/axios'
import { Store } from '@/types'

export const getStores = async (userId: bigint): Promise<Store[]> => {
  const { data } = await axiosInstance.get(`/users/${userId}/stores`)
  return data.stores
}
