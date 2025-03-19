import { MenuLabel, MenuOptionGroupType, MenuStatus } from '@/constants'
import { valueOf } from '@/types/common'

export type Category = {
  id: bigint
  name: string
  position: number
}

export type Menu = {
  id: bigint
  categoryId: bigint
  imageId: bigint
  imageUri?: string
  name: string
  description: string
  price: number
  spicy: number
  status: valueOf<typeof MenuStatus>
  label: valueOf<typeof MenuLabel>
  isPrintEnabled: boolean
  position: number
  optionGroups: MenuOptionGroup[]
}

export type MenuOptionGroup = {
  id: bigint
  name: string
  type: valueOf<typeof MenuOptionGroupType>
  isPrintEnabled: boolean
  options: MenuOption[]
}

export type MenuOption = {
  id: bigint
  name: string
  price: number
}
