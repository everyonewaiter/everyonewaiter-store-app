import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import Button from "@/components/Button";
import CartMenu from "@/components/CartMenu";
import Modal from "@/components/Modal/Modal";
import OrderConfirmModal from "@/components/Modal/OrderConfirmModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import useCart from "@/hooks/useCart";
import { useGetMenus } from "@/hooks/useMenuApi";
import useModal from "@/hooks/useModal";
import { useGetStore } from "@/hooks/useStoreApi";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { ModalName } from "@/stores/modal";

export interface CartModalProps {
  orderSuccessCallback: () => void;
}

const CartModal = ({ orderSuccessCallback }: CartModalProps) => {
  const { height: screenHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);

  const { device } = useAuthentication();
  const { data: store } = useGetStore(device?.storeId);
  const { menus } = useGetMenus(device?.storeId);
  const { cart, clearCart, validateCartItems } = useCart();

  const { openModal, closeAllModals } = useModal();

  useEffect(() => {
    setContentHeight(screenHeight - 100);
  }, [screenHeight]);

  if (!device || !store) return null;

  const openOrderConfirmModal = () => {
    if (!validateCartItems()) {
      return;
    }

    openModal(ModalName.ORDER_CONFIRM, OrderConfirmModal, {
      device: device,
      store: store,
      orderSuccessCallback: orderSuccessCallback,
    });
  };

  return (
    <Modal position="right">
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
        <Pressable style={styles.closeButton} onPress={closeAllModals}>
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
            <CartMenu menus={menus} cartItem={item} cartItemIndex={index} />
          )}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Button label="전체 삭제" variant="outline" onPress={() => clearCart()} />
        </View>
        <View style={{ flex: 2 }}>
          <Button
            label={device.paymentType === "PREPAID" ? "결제하고 주문하기" : "주문하기"}
            onPress={openOrderConfirmModal}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
