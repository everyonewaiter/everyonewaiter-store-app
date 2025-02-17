import { useQuery } from '@tanstack/react-query'

import { getStores } from '@/api/store'
import { queryKeys } from '@/constants'

export const useGetStores = (userId: bigint | undefined) => {
  return useQuery({
    queryKey: [queryKeys.STORE, queryKeys.GET_STORES],
    queryFn: () => getStores(userId!),
    enabled: Boolean(userId),
  })
}
