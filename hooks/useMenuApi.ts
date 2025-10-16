import { useQuery } from "@tanstack/react-query";

import { getMenus } from "@/api/menu";
import { queryKeys } from "@/constants/keys";

export const useGetMenus = (storeId: string | undefined, enabled = true) => {
  const { data } = useQuery({
    queryKey: [queryKeys.MENU, queryKeys.GET_MENUS],
    queryFn: () => getMenus(storeId!),
    enabled: Boolean(storeId) && enabled,
  });

  const categories = data ?? [];
  const menus = categories.flatMap((category) => category.menus);
  const allCategories = [{ categoryId: "0", name: "전체", menus: menus }, ...categories];

  return { allCategories, categories, menus };
};
