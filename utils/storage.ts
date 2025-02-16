import * as SecureStore from 'expo-secure-store'

import JSONBig from 'json-bigint'

export const setItem = async <T>(key: string, value: T) => {
  await SecureStore.setItemAsync(key, JSONBig.stringify(value))
}

export const getItem = async <T>(key: string): Promise<T | null> => {
  const data = await SecureStore.getItemAsync(key)
  return data ? JSONBig.parse(data) : null
}

export const getItemOrElseThrow = async <T>(key: string): Promise<T> => {
  const data = await getItem<T>(key)
  if (!data) {
    throw new Error(`Item not found: ${key}`)
  }
  return data
}

export const removeItem = async (key: string) => {
  const data = await getItem(key)
  if (data) {
    await SecureStore.deleteItemAsync(key)
  }
}
