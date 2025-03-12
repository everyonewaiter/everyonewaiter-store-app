import { DevicePurpose, DeviceStatus, PaymentType } from '@/constants'
import { valueOf } from '@/types/common'

export type Device = {
  id: bigint
  name: string
  tableNo: number
  purpose: valueOf<typeof DevicePurpose>
  paymentType: valueOf<typeof PaymentType>
  status: valueOf<typeof DeviceStatus>
  createdAt: string
}
