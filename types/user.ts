import { UserRole } from '@/constants'
import { valueOf } from '@/types/common'

export type UserProfile = {
  id: bigint
  email: string
  role: valueOf<typeof UserRole>
}
