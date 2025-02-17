import { axiosInstance } from '@/api/axios'
import { AuthenticationPurpose } from '@/constants'
import { valueOf } from '@/types'

type AuthenticationCode = {
  code: string
  phoneNumber: string
  purpose: valueOf<typeof AuthenticationPurpose>
}

type SendAuthenticationCode = Omit<AuthenticationCode, 'code'>

export const sendAuthenticationCode = async ({
  phoneNumber,
  purpose,
}: SendAuthenticationCode): Promise<void> => {
  return await axiosInstance.post(`/authentication/code`, {
    phoneNumber,
    purpose,
  })
}

export const verifyAuthenticationCode = async ({
  code,
  phoneNumber,
  purpose,
}: AuthenticationCode): Promise<void> => {
  return await axiosInstance.post(`/authentication/code/verify`, {
    code,
    phoneNumber,
    purpose,
  })
}
