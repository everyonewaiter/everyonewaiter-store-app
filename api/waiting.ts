import { axiosInstance } from '@/api/axios'
import { WaitingCount } from '@/types'
import { makeSignatureHeader } from '@/utils'

export const getWaitingCount = async (): Promise<WaitingCount> => {
  const headers = await makeSignatureHeader()
  const { data } = await axiosInstance.get(`/waiting/count`, { headers })
  return data
}

type CreateWaitingRequest = {
  phoneNumber: string
  adult: number
  infant: number
}

export const createWaiting = async ({
  ...requestBody
}: CreateWaitingRequest): Promise<void> => {
  const headers = await makeSignatureHeader()
  return await axiosInstance.post(`/waiting`, requestBody, { headers })
}
