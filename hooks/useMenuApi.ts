import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMenus } from "@/api/menu";
import { queryKeys } from "@/constants/keys";

export const useGetMenus = (storeId: string | undefined, enabled = true) => {
  const { data } = useQuery({
    queryKey: [queryKeys.MENU, queryKeys.GET_MENUS],
    queryFn: () => getMenus(storeId!),
    enabled: Boolean(storeId) && enabled,
  });

  const categories = useMemo(() => data ?? [], [data]);
  const menus = useMemo(() => categories.flatMap((category) => category.menus), [categories]);
  const allCategories = useMemo(
    () => [{ categoryId: "0", name: "전체", menus: menus }, ...categories],
    [categories, menus]
  );

  return { allCategories, categories, menus };
};
