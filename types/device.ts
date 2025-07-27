import { DevicePurpose, DeviceState, PaymentType } from '@/constants'

export type AuthenticationCode = {
  code: string
  phoneNumber: string
}

export type SendAuthenticationCode = Omit<AuthenticationCode, 'code'>

export type Device = {
  deviceId: string
  storeId: string
  storeName: string
  name: string
  purpose: keyof typeof DevicePurpose
  tableNo: number
  state: keyof typeof DeviceState
  paymentType: keyof typeof PaymentType
  createdAt: string
  updatedAt: string
}
