import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { getDevice } from '@/api'
import { queryKeys, storageKeys } from '@/constants'
import { removeItem, setItem } from '@/utils'

export const useGetDevice = () => {
  const { data, error, isSuccess, isError, isPending } = useQuery({
    queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
    queryFn: getDevice,
  })

  useEffect(() => {
    if (isSuccess) {
      void Promise.all([
        setItem<string>(storageKeys.DEVICE_ID, data?.deviceId),
        setItem<string>(storageKeys.STORE_ID, data?.storeId),
      ])
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError && isAxiosError(error) && error.response?.status === 404) {
      void Promise.all([
        removeItem(storageKeys.DEVICE_ID),
        removeItem(storageKeys.SECRET_KEY),
        removeItem(storageKeys.STORE_ID),
      ])
    }
  }, [isError, error])

  return { device: data, isSuccess, isError, isPending }
}
