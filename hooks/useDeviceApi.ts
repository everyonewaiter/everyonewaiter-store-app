import { useEffect } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import {
  createDevice,
  getDevice,
  sendAuthenticationCode,
  verifyAuthenticationCode,
} from "@/api/device";
import { queryKeys, storageKeys } from "@/constants/keys";
import { removeItem, setItem } from "@/utils/storage";

export const useSendAuthCode = () => {
  return useMutation({ mutationFn: sendAuthenticationCode });
};

export const useVerifyAuthCode = () => {
  return useMutation({ mutationFn: verifyAuthenticationCode });
};

export const useCreateDevice = () => {
  return useMutation({ mutationFn: createDevice });
};

export const useGetDevice = () => {
  const { data, error, isSuccess, isError, isPending } = useQuery({
    queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
    queryFn: getDevice,
  });

  useEffect(() => {
    if (isSuccess) {
      (async () => {
        await Promise.all([
          setItem<string>(storageKeys.DEVICE_ID, data?.deviceId),
          setItem<string>(storageKeys.STORE_ID, data?.storeId),
        ]);
      })();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError && isAxiosError(error) && error.response?.status === 404) {
      (async () => {
        await Promise.all([
          removeItem(storageKeys.DEVICE_ID),
          removeItem(storageKeys.SECRET_KEY),
          removeItem(storageKeys.STORE_ID),
        ]);
      })();
    }
  }, [isError, error]);

  return { device: data, isSuccess, isError, isPending };
};
