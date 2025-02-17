import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getDevice } from '@/api'
import { queryKeys, storageKeys } from '@/constants'
import { UseQueryOptions } from '@/types'
import { removeItem, setItem } from '@/utils'

export const useGetDevice = (queryOptions?: UseQueryOptions) => {
  const { data, error, isSuccess, isError, isPending } = useQuery({
    queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
    queryFn: getDevice,
    ...queryOptions,
  })

  useEffect(() => {
    if (isSuccess) {
      void setItem(storageKeys.DEVICE, data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError && error.isAxiosError && error.response?.status === 404) {
      void Promise.all([
        removeItem(storageKeys.USER_ID),
        removeItem(storageKeys.DEVICE_ID),
        removeItem(storageKeys.DEVICE),
      ])
    }
  }, [isError, error])

  return { isSuccess, isError, isPending }
}
