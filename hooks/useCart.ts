import { useShallow } from "zustand/react/shallow";

import ErrorModal from "@/components/Modal/ErrorModal";
import { useGetMenus } from "@/hooks/useMenuApi";
import useModal from "@/hooks/useModal";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import useCartStore from "@/stores/cart";
import { ModalName } from "@/stores/modal";
import { Menu } from "@/types/menu";
import { OrderCreateOptionGroup } from "@/types/order";

export const AddCartAction = {
  WITH_OPTION: "withOption",
  WITHOUT_OPTION: "withoutOption",
} as const;

type ResetCartAction = "default" | "force";

const useCart = () => {
  const [cart, setCart, resetCart, isEmpty] = useCartStore(
    useShallow((state) => [state.cart, state.setCart, state.resetCart, state.isEmpty])
  );

  const { device } = useAuthentication();
  const { menus } = useGetMenus(device?.storeId);

  const { openModal, closeAllModals } = useModal();

  const addCartWithoutOption = (menu: Menu) => {
    const copy = [...cart];
    const cartItemIndex = copy.findIndex((item) => item.menuId === menu.menuId);

    if (cartItemIndex === -1) {
      copy.push({ menuId: menu.menuId, quantity: 1, menuOptionGroups: [] });
    } else {
      copy[cartItemIndex].quantity += 1;
    }

    setCart(copy);
    closeAllModals();
  };

  const addCartWithOption = (
    menu: Menu,
    quantity: number,
    selectedMenuOptionGroups: OrderCreateOptionGroup[]
  ) => {
    const copy = [...cart];
    const cartItemIndex = copy
      .filter((cartItem) => cartItem.menuId === menu.menuId)
      .findIndex((cartItem) =>
        compareOrderOptionGroups(cartItem.menuOptionGroups, selectedMenuOptionGroups)
      );

    if (cartItemIndex === -1) {
      copy.push({
        menuId: menu.menuId,
        quantity: quantity,
        menuOptionGroups: selectedMenuOptionGroups,
      });
    } else {
      copy[cartItemIndex].quantity += quantity;
    }

    setCart(copy);
    closeAllModals();
  };

  const compareOrderOptionGroups = (
    gs1: OrderCreateOptionGroup[],
    gs2: OrderCreateOptionGroup[]
  ) => {
    if (gs1.length !== gs2.length) {
      return false;
    }

    for (let i = 0; i < gs1.length; i++) {
      const g1 = gs1[i];
      const g2 = gs2[i];
      if (!compareOrderOptionGroup(g1, g2)) {
        return false;
      }
    }

    return true;
  };

  const compareOrderOptionGroup = (g1: OrderCreateOptionGroup, g2: OrderCreateOptionGroup) => {
    if (g1.menuOptionGroupId !== g2.menuOptionGroupId) {
      return false;
    }

    if (g1.orderOptions.length !== g2.orderOptions.length) {
      return false;
    }

    for (let i = 0; i < g1.orderOptions.length; i++) {
      const o1 = g1.orderOptions[i];
      const o2 = g2.orderOptions[i];
      if (o1.name !== o2.name || o1.price !== o2.price) {
        return false;
      }
    }

    return true;
  };

  const addQuantity = (cartItemIndex: number) => {
    const copy = [...cart];
    copy[cartItemIndex].quantity += 1;
    setCart(copy);
  };

  const minusQuantity = (cartItemIndex: number) => {
    if (cart[cartItemIndex].quantity > 1) {
      const copy = [...cart];
      copy[cartItemIndex].quantity -= 1;
      setCart(copy);
    }
  };

  const removeCartItem = (cartItemIndex: number) => {
    const copy = [...cart];
    copy.splice(cartItemIndex, 1);
    setCart(copy);

    if (copy.length === 0) {
      closeAllModals();
    }
  };

  const clearCart = (action: ResetCartAction = "default") => {
    closeAllModals();
    resetCart();

    if (action === "force") {
      openCartResetModal();
    }
  };

  const calculateCartTotalPrice = () => {
    return cart.reduce((acc, cartItem) => {
      const menu = menus.find((menu) => menu.menuId === cartItem.menuId) as Menu;
      const selectedMenuOptionPrice = cartItem.menuOptionGroups
        .flatMap((selectedMenuOptionGroup) => selectedMenuOptionGroup.orderOptions)
        .reduce((acc, selectedMenuOption) => acc + selectedMenuOption.price, 0);
      return acc + (menu.price + selectedMenuOptionPrice) * cartItem.quantity;
    }, 0);
  };

  const validateCartItems = () => {
    for (const cartItem of cart) {
      const menu = menus.find((menu) => menu.menuId === cartItem.menuId);
      if (!menu || menu.state !== "DEFAULT") {
        clearCart("force");
        return false;
      }

      for (const cartItemMenuOptionGroup of cartItem.menuOptionGroups) {
        const menuOptionGroup = menu.menuOptionGroups.find(
          (menuOptionGroup) =>
            menuOptionGroup.menuOptionGroupId === cartItemMenuOptionGroup.menuOptionGroupId
        );
        if (!menuOptionGroup) {
          clearCart("force");
          return false;
        }

        for (const cartItemOrderOption of cartItemMenuOptionGroup.orderOptions) {
          const menuOption = menuOptionGroup.menuOptions.find(
            (menuOption) =>
              menuOption.name === cartItemOrderOption.name &&
              menuOption.price === cartItemOrderOption.price
          );
          if (!menuOption) {
            clearCart("force");
            return false;
          }
        }
      }
    }

    return true;
  };

  const openCartResetModal = () => {
    openModal(ModalName.CART_RESET, ErrorModal, {
      title: "알림",
      message: "변경된 메뉴 항목이 있습니다.\n장바구니에 메뉴를 다시 담아주세요.",
      onClose: closeAllModals,
    });
  };

  return {
    cart,
    addCart: {
      [AddCartAction.WITH_OPTION]: addCartWithOption,
      [AddCartAction.WITHOUT_OPTION]: addCartWithoutOption,
    },
    addQuantity,
    minusQuantity,
    removeCartItem,
    clearCart,
    calculateCartTotalPrice,
    validateCartItems,
    isEmpty: isEmpty(),
  };
};

export default useCart;
