import { KitchenPrinterLocation, StoreStatus } from '@/constants'
import { valueOf } from '@/types/common'

export type StoreName = {
  storeId: string
  name: string
}

export type Store = {
  id: bigint
  ceoName: string
  name: string
  license: string
  address: string
  landline: string
  status: valueOf<typeof StoreStatus>
  countryOfOrigins: CountryOfOrigin[]
  createdAt: string
  updatedAt: string
}

export type CountryOfOrigin = {
  id: bigint
  item: string
  origin: string
}

export type Setting = {
  id: bigint
  storeId: bigint
  extraTableCount: number
  ksnetDeviceNo: string
  kitchenPrinterLocation: valueOf<typeof KitchenPrinterLocation>
  showMenuPopup: boolean
  showOrderTotalPrice: boolean
  staffCallOptions: string[]
}
