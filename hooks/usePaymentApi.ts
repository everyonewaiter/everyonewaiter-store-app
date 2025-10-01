import { useMutation } from "@tanstack/react-query";

import { createCardPayment } from "@/api/payment";

export const useCreateCardPayment = () => {
  return useMutation({ mutationFn: createCardPayment });
};
