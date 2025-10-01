import { useMutation, useQuery } from "@tanstack/react-query";

import { createWaiting, getWaitingCount } from "@/api/waiting";
import { queryKeys } from "@/constants/keys";

export const useGetWaitingCount = () => {
  const { data } = useQuery({
    queryKey: [queryKeys.WAITING, queryKeys.GET_WAITING_COUNT],
    queryFn: getWaitingCount,
  });

  return { waitingCount: data?.count ?? 0 };
};

export const useCreateWaiting = () => {
  return useMutation({ mutationFn: createWaiting });
};
