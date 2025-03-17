import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getCategories, getMenuImage, getMenus } from '@/api'
import { queryKeys } from '@/constants'

export const useGetCategories = () => {
  const { data, isSuccess } = useQuery({
    queryKey: [queryKeys.CATEGORY, queryKeys.GET_CATEGORIES],
    queryFn: getCategories,
  })

  useEffect(() => {
    if (isSuccess) {
      data?.unshift({ id: BigInt(0), name: '전체', position: 0 })
    }
  }, [isSuccess, data])

  return { categories: data }
}

export const useGetMenus = () => {
  const { data, isSuccess } = useQuery({
    queryKey: [queryKeys.MENU, queryKeys.GET_MENUS],
    queryFn: getMenus,
  })

  useEffect(() => {
    if (isSuccess) {
      Promise.all(
        data?.map(menu => menu.imageId).map(imageId => getMenuImage(imageId)),
      ).then(images =>
        data?.forEach(
          (menu, index) => (menu.imageUri = images[index].accessUri),
        ),
      )
    }
  }, [isSuccess, data])

  return { menus: data }
}
