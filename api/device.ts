import { axiosInstance } from '@/api/axios'
import {
  AuthenticationCode,
  CreateDeviceRequest,
  CreateDeviceResponse,
  Device,
  SendAuthenticationCode,
} from '@/types'
import { makeSignatureHeader } from '@/utils'

export const getDevice = async (): Promise<Device> => {
  const requestMethod = 'GET'
  const requestURI = `/v1/devices`
  const headers = await makeSignatureHeader(requestMethod, requestURI)
  const { data } = await axiosInstance.get(requestURI, { headers })
  return data
}

export const sendAuthenticationCode = async ({
  phoneNumber,
}: SendAuthenticationCode): Promise<void> => {
  return await axiosInstance.post(`/v1/devices/send-auth-code`, { phoneNumber })
}

export const verifyAuthenticationCode = async ({
  code,
  phoneNumber,
}: AuthenticationCode): Promise<void> => {
  return await axiosInstance.post(`/v1/devices/verify-auth-code`, {
    code,
    phoneNumber,
  })
}

export const createDevice = async ({
  storeId,
  ...requestBody
}: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
  const { data } = await axiosInstance.post(
    `/v1/stores/${storeId}/devices`,
    requestBody,
  )
  return data
}
