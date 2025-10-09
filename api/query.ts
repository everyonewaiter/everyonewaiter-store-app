import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/keys";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const cleanUpQueryForTable = () => {
  queryClient.removeQueries({ queryKey: [queryKeys.WAITING] });
};

export const cleanUpQueryForWaiting = () => {
  queryClient.removeQueries({ queryKey: [queryKeys.MENU] });
  queryClient.removeQueries({ queryKey: [queryKeys.ORDER] });
};
