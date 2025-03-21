import { useMutation } from '@tanstack/react-query'

import { createCardPayment } from '@/api'

export const useCreateCardPayment = () => {
  return useMutation({ mutationFn: createCardPayment })
}
