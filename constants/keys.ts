export const storageKeys = {
  DEVICE: 'device',
  DEVICE_ID: 'deviceId',
  SECRET_KEY: 'secretKey',
  STORE_ID: 'storeId',
  USER_ID: 'userId',
} as const

export const queryKeys = {
  DEVICE: 'device',
  GET_DEVICE: 'getDevice',
  STORE: 'store',
  GET_STORE_NAMES: 'getStoreNames',
  USER: 'user',
  GET_PROFILE: 'getProfile',
  WAITING: 'waiting',
  GET_WAITING_COUNT: 'getWaitingCount',
} as const
