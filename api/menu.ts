import { axiosInstance } from "@/api/axios";
import { Category } from "@/types/menu";

export const getMenus = async (storeId: string): Promise<Category[]> => {
  const { data } = await axiosInstance.get(`/v1/stores/${storeId}/menus`);
  return data.categories;
};
