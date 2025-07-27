export const storageKeys = {
  DEVICE_ID: 'deviceId',
  DEVICE_NAME: 'deviceName',
  DEVICE_PURPOSE: 'devicePurpose',
  SECRET_KEY: 'secretKey',
  STORE_ID: 'storeId',
  ACCOUNT_ID: 'accountId',
} as const

export const queryKeys = {
  CATEGORY: 'category',
  GET_CATEGORIES: 'getCategories',
  DEVICE: 'device',
  GET_DEVICE: 'getDevice',
  MENU: 'menu',
  GET_MENUS: 'getMenus',
  ORDER: 'order',
  GET_ORDER_HISTORIES: 'getOrderHistories',
  SETTING: 'setting',
  STORE: 'store',
  GET_STORE: 'getStore',
  GET_STORE_NAMES: 'getStoreNames',
  ACCOUNT: 'account',
  GET_PROFILE: 'getProfile',
  WAITING: 'waiting',
  GET_WAITING_COUNT: 'getWaitingCount',
} as const
