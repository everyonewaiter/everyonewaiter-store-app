import { axiosInstance } from '@/api/axios'
import { DevicePurpose, PaymentType, storageKeys } from '@/constants'
import { Device, valueOf } from '@/types'
import { getItemOrElseThrow } from '@/utils'

export const getDevice = async (): Promise<Device> => {
  const deviceId = await getItemOrElseThrow<string>(storageKeys.DEVICE_ID)
  const { data } = await axiosInstance.get(`/devices/${deviceId}`)
  return data
}

type CreateDeviceRequest = {
  userId: bigint
  storeId: bigint
  name: string
  tableNo: number
  purpose: valueOf<typeof DevicePurpose>
  paymentType: valueOf<typeof PaymentType>
}

type CreateDeviceResponse = {
  id: bigint
  secretKey: string
}

export const createDevice = async ({
  userId,
  storeId,
  ...requestBody
}: CreateDeviceRequest): Promise<CreateDeviceResponse> => {
  const { data } = await axiosInstance.post(
    `/users/${userId}/stores/${storeId}/devices`,
    requestBody,
  )
  return data
}
