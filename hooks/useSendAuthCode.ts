import { useMutation } from "@tanstack/react-query";

import { sendAuthenticationCode } from "@/api/device";

export const useSendAuthCode = () => {
  return useMutation({ mutationFn: sendAuthenticationCode });
};
