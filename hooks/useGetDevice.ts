import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { getDevice } from '@/api'
import { queryKeys, storageKeys } from '@/constants'
import { Device } from '@/types'
import { removeItem, setItem } from '@/utils'

export const useGetDevice = () => {
  const { data, error, isSuccess, isError, isPending } = useQuery({
    queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
    queryFn: getDevice,
  })

  useEffect(() => {
    if (isSuccess) {
      void setItem<Device>(storageKeys.DEVICE, data)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError && isAxiosError(error) && error.response?.status === 404) {
      void Promise.all([
        removeItem(storageKeys.DEVICE),
        removeItem(storageKeys.DEVICE_ID),
        removeItem(storageKeys.SECRET_KEY),
        removeItem(storageKeys.STORE_ID),
        removeItem(storageKeys.USER_ID),
      ])
    }
  }, [isError, error])

  return { isSuccess, isError, isPending }
}
