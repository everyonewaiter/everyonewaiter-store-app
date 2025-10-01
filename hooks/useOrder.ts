import { useMutation, useQuery } from "@tanstack/react-query";

import { createTableOrder, getTableOrderHistories } from "@/api";
import { queryKeys } from "@/constants";

export const useGetTableOrderHistories = (tableNo: number | undefined) => {
  const { data } = useQuery({
    queryKey: [queryKeys.ORDER, String(tableNo), queryKeys.GET_ORDER_HISTORIES],
    queryFn: getTableOrderHistories,
    enabled: Boolean(tableNo),
  });
  return { histories: data ?? [] };
};

export const useCreateTableOrder = () => {
  return useMutation({ mutationFn: createTableOrder });
};
