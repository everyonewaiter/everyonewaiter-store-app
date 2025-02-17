import { useQuery } from '@tanstack/react-query'

import { getProfile } from '@/api'
import { queryKeys } from '@/constants'

export const useGetProfile = (phoneNumber: string, enabled = true) => {
  return useQuery({
    queryKey: [queryKeys.USER, queryKeys.GET_PROFILE],
    queryFn: () => getProfile(phoneNumber),
    enabled,
  })
}
