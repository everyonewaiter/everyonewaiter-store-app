import { axiosInstance } from "@/api/axios";
import { AccountProfile } from "@/types";

export const getProfile = async (phoneNumber: string): Promise<AccountProfile> => {
  const { data } = await axiosInstance.get(`/v1/accounts/phone-number/${phoneNumber}/me`);
  return data;
};
