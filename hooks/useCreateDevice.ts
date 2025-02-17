import { useMutation } from '@tanstack/react-query'

import { createDevice } from '@/api'

export const useCreateDevice = () => {
  return useMutation({ mutationFn: createDevice })
}
