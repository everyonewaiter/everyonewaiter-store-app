import { useMutation } from '@tanstack/react-query'

import { createStaffCall } from '@/api'

export const useStaffCall = () => {
  return useMutation({ mutationFn: createStaffCall })
}
