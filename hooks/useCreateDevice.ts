import { useMutation } from "@tanstack/react-query";

import { createDevice } from "@/api/device";

export const useCreateDevice = () => {
  return useMutation({ mutationFn: createDevice });
};
