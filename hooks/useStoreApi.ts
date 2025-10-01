import { useQuery } from "@tanstack/react-query";

import { getStore, getStoreNames } from "@/api/store";
import { queryKeys } from "@/constants/keys";

export const useGetStores = (accountId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: [queryKeys.STORE, queryKeys.GET_STORE_NAMES],
    queryFn: () => getStoreNames(accountId!),
    enabled: Boolean(accountId) && enabled,
  });
};

export const useGetStore = (storeId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: [queryKeys.STORE, queryKeys.GET_STORE],
    queryFn: () => getStore(storeId!),
    enabled: Boolean(storeId) && enabled,
  });
};
