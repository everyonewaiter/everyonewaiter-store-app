import { axiosInstance } from '@/api/axios'
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
