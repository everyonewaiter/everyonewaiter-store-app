import { useQuery } from '@tanstack/react-query'

import { getSetting, getStore, getStoreNames } from '@/api/store'
import { queryKeys } from '@/constants'

export const useGetStores = (accountId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: [queryKeys.STORE, queryKeys.GET_STORE_NAMES],
    queryFn: () => getStoreNames(accountId!),
    enabled: Boolean(accountId) && enabled,
  })
}

export const useGetStore = () => {
  return useQuery({
    queryKey: [queryKeys.STORE, queryKeys.GET_STORE],
    queryFn: getStore,
  })
}

export const useGetSetting = () => {
  return useQuery({
    queryKey: [queryKeys.SETTING],
    queryFn: getSetting,
  })
}
