import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import Button from "@/components/Button";
import CartMenu from "@/components/CartMenu";
import ErrorModal from "@/components/Modal/ErrorModal";
import Modal from "@/components/Modal/Modal";
import SuccessModal from "@/components/Modal/SuccessModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import useCart from "@/hooks/useCart";
import { useGetMenus } from "@/hooks/useMenuApi";
import useModal from "@/hooks/useModal";
import { useCreateTableOrder } from "@/hooks/useOrderApi";
import { useCreateCardPayment } from "@/hooks/usePaymentApi";
import { useGetStore } from "@/hooks/useStoreApi";
import KscatModule, { KscatResponse } from "@/modules/kscat";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { ModalName } from "@/stores/modal";
import { calculateService, calculateVat } from "@/utils/calculate";
import { parseErrorMessage } from "@/utils/support";

export interface CartModalProps {
  successCallback: () => void;
}

const CartModal = ({ successCallback }: CartModalProps) => {
  const { height: screenHeight } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { device } = useAuthentication();
  const { data: store } = useGetStore(device?.storeId);
  const { menus } = useGetMenus(device?.storeId);
  const { cart, clearCart, calculateCartTotalPrice, validateCartItems } = useCart();

  const { mutate: mutateCreateOrder } = useCreateTableOrder();
  const { mutate: mutateCreatePayment } = useCreateCardPayment();

  const { openModal, closeAllModals } = useModal();

  useEffect(() => {
    setContentHeight(screenHeight - 100);
  }, [screenHeight]);

  if (!device || !store) return null;

  const handleOnSubmit = async () => {
    setIsLoading(true);
    if (!validateCartItems()) {
      return;
    }

    if (device.paymentType === "PREPAID") {
      const ksnetDeviceNo = store.setting.ksnetDeviceNo;

      if (ksnetDeviceNo.length < 8 || ksnetDeviceNo.startsWith("DPTOTEST")) {
        openModal(ModalName.KSNET_DEVICE_NO_NOT_INITIALIZED, ErrorModal, {
          title: "단말기 번호가 등록되지 않았습니다.",
          message: "설정 페이지에서 Ksnet 단말기 번호를 등록해주세요.",
          onClose: closeAllModals,
        });
      } else {
        try {
          const amount = calculateCartTotalPrice();
          const installment = "00";
          const response = await KscatModule.approveIC(ksnetDeviceNo, installment, amount);
          createPayment(amount, installment, response);
        } catch (exception: any) {
          if (exception.code === "FAIL") {
            openModal(ModalName.KSNET_PAYMENT_ERROR, ErrorModal, {
              title: "결제 실패",
              message: exception.message,
              onClose: closeAllModals,
            });
          } else {
            openModal(ModalName.KSNET_PAYMENT_ERROR, ErrorModal, {
              title: "결제 오류",
              message: exception.message,
              onClose: closeAllModals,
            });
          }
        }
      }
    } else {
      createOrder();
    }
  };

  const createOrder = () => {
    mutateCreateOrder(
      { tableNo: device.tableNo, memo: "", orderMenus: cart },
      {
        onSuccess: () => {
          openModal(ModalName.ORDER_SUCCESS, SuccessModal, {
            title: "주문 완료",
            image: images.COMPLETE_ANIMATION,
            message: "주문이 완료되었습니다.",
            onClose: successCallback,
          });
        },
        onError: (error) => {
          openModal(ModalName.ORDER_ERROR, ErrorModal, {
            title: "주문 실패",
            message: parseErrorMessage(error),
            onClose: closeAllModals,
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const createPayment = (amount: number, installment: string, response: KscatResponse) => {
    const service = calculateService(amount, 0);
    const vat = calculateVat(amount, service, 10);

    mutateCreatePayment(
      {
        tableNo: device.tableNo,
        amount: amount,
        approvalNo: response.approvalNo,
        installment: installment,
        cardNo: response.filler,
        issuerName: response.message1,
        purchaseName: response.purchaseCompanyName,
        merchantNo: response.merchantNo,
        tradeTime: response.transferDate,
        tradeUniqueNo: response.transactionUniqueNo,
        vat: vat,
        supplyAmount: amount - service - vat,
      },
      {
        onSuccess: () => createOrder(),
        onError: (error) => {
          openModal(ModalName.ORDER_PAYMENT_ERROR, ErrorModal, {
            title: "오류: 직원을 호출하여 결제를 취소하세요.",
            message: parseErrorMessage(error),
            onClose: closeAllModals,
          });
        },
      }
    );
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
            onPress={handleOnSubmit}
            disabled={isLoading}
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
