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
