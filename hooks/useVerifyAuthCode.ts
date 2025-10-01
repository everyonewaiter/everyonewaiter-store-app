import { useMutation } from "@tanstack/react-query";

import { verifyAuthenticationCode } from "@/api/device";

export const useVerifyAuthCode = () => {
  return useMutation({ mutationFn: verifyAuthenticationCode });
};
