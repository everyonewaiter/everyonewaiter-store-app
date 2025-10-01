import { axiosInstance } from "@/api/axios";
import { ApkVersion } from "@/types/health";

export const getApkVersion = async (): Promise<ApkVersion> => {
  const { data } = await axiosInstance.get(`/v1/health/apk-versions`);
  return data;
};
