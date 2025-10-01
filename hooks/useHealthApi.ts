import { useQuery } from "@tanstack/react-query";

import { getApkVersion } from "@/api/health";
import { queryKeys } from "@/constants/keys";

export const useGetApkVersion = () => {
  const { data, isSuccess, isPending } = useQuery({
    queryKey: [queryKeys.HEALTH, queryKeys.GET_APK_VERSION],
    queryFn: getApkVersion,
  });
  return { apkVersion: data, isSuccess, isPending };
};
