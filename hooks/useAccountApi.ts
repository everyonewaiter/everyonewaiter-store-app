import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/api/account";
import { queryKeys } from "@/constants/keys";
import { validatePhoneNumber } from "@/utils/validation";

export const useGetProfile = (phoneNumber: string, enabled = true) => {
  return useQuery({
    queryKey: [queryKeys.ACCOUNT, queryKeys.GET_PROFILE],
    queryFn: () => getProfile(phoneNumber),
    enabled: validatePhoneNumber(phoneNumber).length === 0 && enabled,
  });
};
