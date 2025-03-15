import { ForwardedRef } from 'react'

import { isAxiosError } from 'axios'
import CryptoJS from 'crypto-js'

import { storageKeys } from '@/constants'
import { Device } from '@/types'
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

export const makeSignatureHeader = async () => {
  const [device, secretKey] = await Promise.all([
    getItem<Device>(storageKeys.DEVICE),
    getItem<string>(storageKeys.SECRET_KEY),
  ])

  if (!device || !secretKey) {
    throw new Error('Device or Secret key not found')
  }

  const accessKey = device.id.toString()
  const timestamp = Date.now().toString()
  const signature = makeSignature(device, secretKey, timestamp)

  return {
    'x-ew-access-key': accessKey,
    'x-ew-signature': signature,
    'x-ew-timestamp': timestamp,
  }
}

export const makeSignature = (
  device: Device,
  secretKey: string,
  timestamp: string,
) => {
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey)
  hmac.update(`${device.purpose} ${device.name}`)
  hmac.update('\n')
  hmac.update(device.id.toString())
  hmac.update('\n')
  hmac.update(timestamp)
  const hash = hmac.finalize()
  return hash.toString(CryptoJS.enc.Base64)
}
