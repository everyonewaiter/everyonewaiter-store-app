import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMenus } from "@/api";
import { queryKeys } from "@/constants";

export const useGetMenus = (storeId: string | undefined, enabled = true) => {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: [queryKeys.MENU, queryKeys.GET_MENUS],
    queryFn: () => getMenus(storeId!),
    enabled: Boolean(storeId) && enabled,
  });

  useEffect(() => {
    if (!isPending && isSuccess && data) {
      data.forEach((category) => {
        category.menus = category.menus.filter((menu) => menu.state !== "HIDE");
      });

      if (!data.some((category) => category.categoryId === "0")) {
        data.unshift({
          categoryId: "0",
          name: "전체",
          menus: data?.flatMap((category) => category.menus),
        });
      }
    }
  }, [isPending, isSuccess, data]);

  return { categories: data };
};
