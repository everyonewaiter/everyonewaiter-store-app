import { useQuery } from "@tanstack/react-query";

import { getApkVersion } from "@/api";
import { queryKeys } from "@/constants";

export const useGetApkVersion = () => {
  const { data, isSuccess, isPending } = useQuery({
    queryKey: [queryKeys.HEALTH, queryKeys.GET_APK_VERSION],
    queryFn: getApkVersion,
  });
  return { apkVersion: data, isSuccess, isPending };
};
