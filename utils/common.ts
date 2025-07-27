import { ForwardedRef } from 'react'

import { isAxiosError } from 'axios'
import CryptoJS from 'crypto-js'

import { DevicePurpose, storageKeys } from '@/constants'
import { getItem } from '@/utils/storage'

export const parseErrorMessage = (error: Error) => {
  if (isAxiosError(error)) {
    return error.response?.data.message ?? error.message
  }
  return error.message
}

export const mergeRefs = <T>(...refs: ForwardedRef<T>[]) => {
  return (node: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}

export const clearNullableInterval = (interval: NodeJS.Timeout | null) => {
  if (interval) {
    clearInterval(interval)
  }
}

export const getNavigatePath = (purpose: keyof typeof DevicePurpose) => {
  switch (purpose) {
    case 'WAITING':
      return '/waiting/registration'
    case 'TABLE':
      return '/table/customer'
    default:
      throw new Error('Unknown device purpose')
  }
}

export const makeSignatureHeader = async (
  requestMethod: string,
  requestURI: string,
) => {
  const [deviceId, devicePurpose, deviceName, secretKey] = await Promise.all([
    getItem<string>(storageKeys.DEVICE_ID),
    getItem<string>(storageKeys.DEVICE_PURPOSE),
    getItem<string>(storageKeys.DEVICE_NAME),
    getItem<string>(storageKeys.SECRET_KEY),
  ])

  if (!deviceId || !devicePurpose || !deviceName || !secretKey) {
    throw new Error('Device information not found')
  }

  const accessKey = deviceId
  const timestamp = Date.now().toString()
  const signature = makeSignature(
    requestMethod,
    requestURI,
    deviceId,
    devicePurpose,
    deviceName,
    secretKey,
    timestamp,
  )

  return {
    'x-ew-access-key': accessKey,
    'x-ew-signature': signature,
    'x-ew-timestamp': timestamp,
  }
}

export const makeSignature = (
  requestMethod: string,
  requestURI: string,
  deviceId: string,
  devicePurpose: string,
  deviceName: string,
  secretKey: string,
  timestamp: string,
) => {
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey)
  hmac.update(`${requestMethod} ${requestURI}`)
  hmac.update('\n')
  hmac.update(`${deviceId} ${devicePurpose} ${deviceName}`)
  hmac.update('\n')
  hmac.update(timestamp)
  const hash = hmac.finalize()
  return hash.toString(CryptoJS.enc.Base64)
}
