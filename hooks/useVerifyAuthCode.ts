import { useMutation } from "@tanstack/react-query";

import { verifyAuthenticationCode } from "@/api";

export const useVerifyAuthCode = () => {
  return useMutation({ mutationFn: verifyAuthenticationCode });
};
