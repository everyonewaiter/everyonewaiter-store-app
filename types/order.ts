import { OrderCategory, OrderStatus, PaymentType } from '@/constants'
import { valueOf } from '@/types/common'
import { MenuOptionGroup } from '@/types/menu'

export type OrderCreate = {
  menuId: bigint
  count: number
  optionGroups: OrderCreateOptionGroup[]
}

export type OrderCreateOptionGroup = {
  groupId: bigint
  options: OrderCreateOption[]
}

export type OrderCreateOption = {
  optionId: bigint
}

export type Order = {
  id: bigint
  storeId: bigint
  tableNo: number
  category: valueOf<typeof OrderCategory>
  paymentType: valueOf<typeof PaymentType>
  memo: string
  status: valueOf<typeof OrderStatus>
  isServed: boolean
  servedTime: string
  menus: OrderMenu[]
  createdAt: string
  updatedAt: string
}

export type OrderMenu = {
  id: bigint
  name: string
  price: number
  count: number
  isServed: boolean
  isPrintEnabled: boolean
  optionGroups: Omit<MenuOptionGroup[], 'type'>
}
