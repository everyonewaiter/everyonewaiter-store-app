import { axiosInstance } from '@/api/axios'
import { storageKeys } from '@/constants'
import { Device } from '@/types'
import { getItemOrElseThrow } from '@/utils'

export const getDevice = async (): Promise<Device> => {
  const deviceId = await getItemOrElseThrow<string>(storageKeys.DEVICE_ID)
  const { data } = await axiosInstance.get(`/devices/${deviceId}`)
  return data
}
