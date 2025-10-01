import { useMutation } from "@tanstack/react-query";

import { sendAuthenticationCode } from "@/api";

export const useSendAuthCode = () => {
  return useMutation({ mutationFn: sendAuthenticationCode });
};
