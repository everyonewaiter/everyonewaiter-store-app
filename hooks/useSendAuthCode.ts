import { useMutation } from '@tanstack/react-query'

import { sendAuthenticationCode } from '@/api'
import { UseMutationOptions } from '@/types'

export const useSendAuthCode = (mutationOptions?: UseMutationOptions) => {
  return useMutation({
    mutationFn: sendAuthenticationCode,
    ...mutationOptions,
  })
}
