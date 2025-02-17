import { useMutation } from '@tanstack/react-query'

import { verifyAuthenticationCode } from '@/api'
import { UseMutationOptions } from '@/types'

export const useVerifyAuthCode = (mutationOptions?: UseMutationOptions) => {
  return useMutation({
    mutationFn: verifyAuthenticationCode,
    ...mutationOptions,
  })
}
