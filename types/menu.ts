import { MenuLabel, MenuOptionGroupType, MenuState } from '@/constants'

export type Category = {
  categoryId: string
  name: string
  menus: Menu[]
}

export type Menu = {
  menuId: string
  categoryId: string
  name: string
  description: string
  price: number
  spicy: number
  state: keyof typeof MenuState
  label: keyof typeof MenuLabel
  image: string
  printEnabled: boolean
  menuOptionGroups: MenuOptionGroup[]
}

export type MenuOptionGroup = {
  menuOptionGroupId: string
  name: string
  type: keyof typeof MenuOptionGroupType
  printEnabled: boolean
  menuOptions: MenuOption[]
}

export type MenuOption = {
  name: string
  price: number
}
