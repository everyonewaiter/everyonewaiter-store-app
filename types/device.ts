import { DevicePurpose, DeviceStatus } from '@/constants'
import { valueOf } from '@/types/common'

export type Device = {
  id: bigint
  name: string
  tableNo: number
  purpose: valueOf<typeof DevicePurpose>
  status: valueOf<typeof DeviceStatus>
  createdAt: string
}
