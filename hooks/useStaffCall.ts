import { useMutation } from "@tanstack/react-query";

import { createStaffCall } from "@/api/order";

export const useStaffCall = () => {
  return useMutation({ mutationFn: createStaffCall });
};
