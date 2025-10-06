import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import useCart from "@/hooks/useCart";
import { Menu } from "@/types/menu";
import { OrderCreate } from "@/types/order";

interface CartMenuProps {
  menus: Menu[];
  cartItem: OrderCreate;
  cartItemIndex: number;
}

const CartMenu = ({ menus, cartItem, cartItemIndex }: CartMenuProps) => {
  const { addQuantity, minusQuantity, removeCartItem, clearCart } = useCart();

  const menu = menus
    .filter((menu) => menu.state === "DEFAULT")
    .find((menu) => menu.menuId === cartItem.menuId);

  if (!menu) {
    clearCart("force");
    return;
  }

  const selectedMenuOptions = cartItem.menuOptionGroups.flatMap(
    (menuOptionGroup) => menuOptionGroup.orderOptions
  );

  const selectedMenuOptionPrice = selectedMenuOptions.reduce(
    (acc, selectedMenuOption) => acc + selectedMenuOption.price,
    0
  );

  const totalPrice = (menu.price + selectedMenuOptionPrice) * cartItem.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuName}>{menu.name}</Text>
        <Text style={styles.menuPrice}>{menu.price.toPrice()}원</Text>
      </View>
      {selectedMenuOptions.length > 0 && (
        <View style={{ gap: 4 }}>
          {selectedMenuOptions.map((selectedMenuOption, index) => (
            <View
              key={`${selectedMenuOption.name}-${selectedMenuOption.price}-${index}`}
              style={styles.menuOptionContainer}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.menuOption}>+ {selectedMenuOption.name}</Text>
              </View>
              <Text style={styles.menuOption}>{selectedMenuOption.price.toPrice()}원</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.divider} />
      <View style={{ flexDirection: "row", marginTop: 8, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable style={styles.quantityButton} onPress={() => minusQuantity(cartItemIndex)}>
            <AntDesign name="minus" size={24} color="black" />
          </Pressable>
          <Text style={styles.quantityText}>{cartItem.quantity}</Text>
          <Pressable style={styles.quantityButton} onPress={() => addQuantity(cartItemIndex)}>
            <AntDesign name="plus" size={24} color="black" />
          </Pressable>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Text style={styles.totalPrice}>{totalPrice.toPrice()}원</Text>
        </View>
      </View>
      <Pressable style={{ alignItems: "flex-end" }} onPress={() => removeCartItem(cartItemIndex)}>
        <Text style={styles.removeText}>삭제</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  menuName: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
  },
  menuPrice: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 18,
  },
  menuOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuOption: {
    color: colors.BLUE,
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY7_F1,
    marginTop: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: colors.GRAY7_F1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    paddingHorizontal: 12,
  },
  totalPrice: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 24,
    color: colors.PRIMARY_RED,
  },
  removeText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
    color: colors.PRIMARY_RED,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.PRIMARY_RED,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

export default CartMenu;
