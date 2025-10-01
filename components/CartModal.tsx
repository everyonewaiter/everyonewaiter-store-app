import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import Button from "@/components/Button";
import CartMenu from "@/components/CartMenu";
import { colors } from "@/constants/colors";
import { PaymentType } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import { Menu } from "@/types/menu";
import { OrderCreate } from "@/types/order";

interface CartModalProps {
  visible: boolean;
  menus: Menu[];
  cart: OrderCreate[];
  setCart: React.Dispatch<React.SetStateAction<OrderCreate[]>>;
  resetCart: () => void;
  paymentType: keyof typeof PaymentType;
  submit: () => void;
  close: () => void;
}

const CartModal = ({
  visible,
  menus,
  cart,
  setCart,
  resetCart,
  paymentType,
  submit,
  close,
}: CartModalProps) => {
  const { height: screenHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setContentHeight(screenHeight - 100);
  }, [screenHeight]);

  const addQuantity = (index: number) => {
    const copy = [...cart];
    copy[index].quantity += 1;
    setCart(copy);
  };

  const minusQuantity = (index: number) => {
    if (cart[index].quantity > 1) {
      const copy = [...cart];
      copy[index].quantity -= 1;
      setCart(copy);
    }
  };

  const removeItem = (index: number) => {
    const copy = [...cart];
    copy.splice(index, 1);
    setCart(copy);
    if (copy.length === 0) {
      close();
    }
  };

  return (
    <>
      {visible && (
        <View style={styles.container}>
          <View style={[styles.container, styles.overlay]}></View>
          <View style={styles.modalContainer}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.cartTitleText}>장바구니</Text>
                <Text style={styles.cartCountText}>{cart.length}</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={close}>
                <AntDesign name="close" size={28} color="black" />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                style={{ height: contentHeight }}
                data={cart}
                keyExtractor={(item, index) => `${item.menuId}-${index}`}
                contentContainerStyle={{
                  backgroundColor: colors.GRAY7_F1,
                  borderRadius: 16,
                  padding: 12,
                  gap: 12,
                }}
                renderItem={({ item, index }) => (
                  <CartMenu
                    index={index}
                    menus={menus}
                    item={item}
                    resetCart={resetCart}
                    addQuantity={addQuantity}
                    minusQuantity={minusQuantity}
                    removeItem={removeItem}
                  />
                )}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Button
                  label="전체 삭제"
                  variant="outline"
                  onPress={() => {
                    setCart([]);
                    close();
                  }}
                />
              </View>
              <View style={{ flex: 2 }}>
                <Button
                  label={paymentType === "PREPAID" ? "결제하고 주문하기" : "주문하기"}
                  onPress={submit}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 24,
    width: "40%",
    height: "100%",
    gap: 12,
  },
  cartTitleText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 20,
  },
  cartCountText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
    color: colors.WHITE,
    backgroundColor: colors.PRIMARY_RED,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  closeButton: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default CartModal;
