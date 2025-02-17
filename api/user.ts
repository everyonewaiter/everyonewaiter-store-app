import { axiosInstance } from '@/api/axios'
import { UserProfile } from '@/types'

export const getProfile = async (phoneNumber: string): Promise<UserProfile> => {
  const { data } = await axiosInstance.get(`/users/${phoneNumber}/profile`)
  return data
}
