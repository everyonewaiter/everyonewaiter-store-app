import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { BellIcon } from "@/assets/icons/BellIcon";
import { ReceiptIcon } from "@/assets/icons/ReceiptIcon";
import CategoryButton from "@/components/CategoryButton";
import MenuCard from "@/components/MenuCard";
import CartModal from "@/components/Modal/CartModal";
import CountryOfOriginModal from "@/components/Modal/CountryOfOriginModal";
import ErrorModal from "@/components/Modal/ErrorModal";
import MenuModal from "@/components/Modal/MenuModal";
import OrderHistoryModal from "@/components/Modal/OrderHistoryModal";
import StaffCallModal from "@/components/Modal/StaffCallModal";
import SuccessModal from "@/components/Modal/SuccessModal";
import { colors } from "@/constants/colors";
import { defaultCategory } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import { milliTimes } from "@/constants/times";
import useIdle from "@/hooks/useIdle";
import { useGetMenus } from "@/hooks/useMenuApi";
import useModal from "@/hooks/useModal";
import { useCreateTableOrder, useGetTableOrderHistories, useStaffCall } from "@/hooks/useOrderApi";
import { useCreateCardPayment } from "@/hooks/usePaymentApi";
import { useGetStore } from "@/hooks/useStoreApi";
import KscatModule, { KscatResponse } from "@/modules/kscat";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { ModalName } from "@/stores/modal";
import { Category, Menu } from "@/types/menu";
import { OrderCreate } from "@/types/order";
import { calculateService, calculateVat } from "@/utils/calculate";
import { parseErrorMessage } from "@/utils/support";

const CustomerTableScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { idleTime, resetIdleTime, gesture } = useIdle(milliTimes.THREE_MINUTE);

  const menusRef = useRef<FlatList | null>(null);
  const categoriesRef = useRef<FlatList | null>(null);

  const { device } = useAuthentication();
  const { data: store } = useGetStore(device?.storeId);
  const { categories } = useGetMenus(device?.storeId);
  const { histories } = useGetTableOrderHistories(device?.tableNo);

  // Menu
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const existsCategory = categories && categories.length > 0;
  const existsMenu = selectedCategory && selectedCategory.menus.length > 0;

  // Order
  const [cart, setCart] = useState<OrderCreate[]>([]);
  const [selectedStaffCallOption, setSelectedStaffCallOption] = useState("");
  const staffCall = useStaffCall();
  const createTableOrder = useCreateTableOrder();
  const createCardPayment = useCreateCardPayment();

  // Modal
  const { isOpenedModal, openModal, closeAllModals } = useModal();

  const resetScroll = useCallback(() => {
    if (existsCategory) categoriesRef.current?.scrollToIndex({ index: 0 });
    if (existsMenu) menusRef.current?.scrollToIndex({ index: 0 });
  }, [existsCategory, existsMenu]);

  const resetAll = useCallback(() => {
    closeAllModals();
    setCart([]);
    setSelectedCategory(existsCategory ? categories[0] : defaultCategory);
    setSelectedStaffCallOption("");
    resetScroll();
    resetIdleTime();
  }, [closeAllModals, existsCategory, categories, resetScroll, resetIdleTime]);

  useEffect(() => {
    if (existsCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, existsCategory]);

  useEffect(() => {
    // TODO: 장바구니가 비어 있지 않거나, 카테고리 또는 메뉴의 스크롤 index가 0이 아닌 경우 초기화
    if (idleTime <= milliTimes.ZERO && isOpenedModal) {
      resetAll();
    }
  }, [idleTime, isOpenedModal, resetAll]);

  if (!device || !store) {
    return null;
  }

  const openCountryOfOriginModal = () => {
    openModal(ModalName.COUNTRY_OF_ORIGIN, CountryOfOriginModal, {
      countryOfOrigins: store.setting.countryOfOrigins,
      onClose: closeAllModals,
    });
  };

  const openStaffCallModal = () => {
    openModal(ModalName.STAFF_CALL, StaffCallModal, {
      options: store.setting.staffCallOptions,
      selectedOption: selectedStaffCallOption,
      setSelectedOption: setSelectedStaffCallOption,
      onSubmit: submitStaffCall,
      onClose: () => {
        setSelectedStaffCallOption("");
        closeAllModals();
      },
    });
  };

  const openOrderHistoryModal = () => {
    if (histories.length > 0) {
      openModal(ModalName.ORDER_HISTORY, OrderHistoryModal, {
        histories: histories,
        setting: store.setting,
        onClose: closeAllModals,
      });
    }
  };

  const openMenuModalOrAddToCart = (menu: Menu) => {
    if (store.setting.showMenuPopup || menu.menuOptionGroups.length > 0) {
      openModal(ModalName.MENU, MenuModal, {
        menu: menu,
        cart: cart,
        setCart: setCart,
        onClose: closeAllModals,
      });
    } else {
      const copy = [...cart];
      const index = copy.findIndex((item) => item.menuId === menu.menuId);
      if (index === -1) {
        copy.push({ menuId: menu.menuId, quantity: 1, menuOptionGroups: [] });
      } else {
        copy[index].quantity += 1;
      }
      setCart(copy);
    }
  };

  const openCartModal = () => {
    if (existsCategory && cart.length > 0) {
      openModal(ModalName.CART, CartModal, {
        menus: categories[0].menus,
        cart: cart,
        setCart: setCart,
        resetCart: forceResetCart,
        paymentType: device.paymentType,
        onSubmit: submitCreateOrder,
        onClose: closeAllModals,
      });
    }
  };

  const openCartResetModal = () => {
    openModal(ModalName.CART_RESET, ErrorModal, {
      title: "알림",
      message: "변경된 메뉴 항목이 있습니다.\n장바구니에 메뉴를 다시 담아주세요.",
      onClose: closeAllModals,
    });
  };

  const handleOnChangeCategory = (category: Category, index: number) => {
    setSelectedCategory(category);
    categoriesRef.current?.scrollToIndex({ index });
  };

  const calculateCartTotalPrice = () => {
    let totalPrice = 0;
    for (const orderCreate of cart) {
      const menu = categories?.[0].menus.find((menu) => menu.menuId === orderCreate.menuId);
      if (!menu) {
        forceResetCart();
        return;
      }

      let optionPrice = 0;
      const menuOptions = menu.menuOptionGroups.flatMap((group) => group.menuOptions);
      orderCreate.menuOptionGroups
        .flatMap((group) => group.orderOptions)
        .forEach((option) => {
          const menuOption = menuOptions.find(
            (menuOption) => menuOption.name === option.name && menuOption.price === option.price
          );
          if (!menuOption) {
            forceResetCart();
            return;
          }
          optionPrice += menuOption.price;
        });
      totalPrice += (menu.price + optionPrice) * orderCreate.quantity;
    }
    return totalPrice;
  };

  const forceResetCart = () => {
    closeAllModals();
    setCart([]);
    openCartResetModal();
  };

  const submitStaffCall = () => {
    if (selectedStaffCallOption) {
      staffCall.mutate(
        { optionName: selectedStaffCallOption },
        {
          onSuccess: () => {
            openModal(ModalName.STAFF_CALL_SUCCESS, SuccessModal, {
              title: selectedStaffCallOption,
              image: images.BELL_ANIMATION,
              message: "직원을 호출했습니다. 잠시만 기다려주세요!",
              onClose: () => {
                setSelectedStaffCallOption("");
                closeAllModals();
              },
            });
          },
          onError: (error) => {
            openModal(ModalName.STAFF_CALL_ERROR, ErrorModal, {
              title: "직원 호출 실패",
              message: parseErrorMessage(error),
              onClose: closeAllModals,
            });
          },
        }
      );
    }
  };

  const submitCreateOrder = async () => {
    if (cart.length <= 0) {
      return;
    }

    if (store.setting.ksnetDeviceNo.length < 8) {
      openModal(ModalName.KSNET_DEVICE_NO_NOT_INITIALIZED, ErrorModal, {
        title: "단말기 번호가 등록되지 않았습니다.",
        message: "설정 페이지에서 Ksnet 단말기 번호를 등록해주세요.",
        onClose: closeAllModals,
      });
      return;
    }

    if (device.paymentType === "POSTPAID") {
      createOrder();
      return;
    }

    const amount = calculateCartTotalPrice();
    if (!amount) {
      return;
    }

    try {
      const installment = "00";
      const response = await KscatModule.approveIC(
        store.setting.ksnetDeviceNo,
        installment,
        amount
      );
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
  };

  const createPayment = (amount: number, installment: string, response: KscatResponse) => {
    const service = calculateService(amount, 0);
    const vat = calculateVat(amount, service, 10);
    createCardPayment.mutate(
      {
        tableNo: device?.tableNo ?? 0,
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
        onSuccess: () => {
          createOrder();
        },
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

  const createOrder = () => {
    createTableOrder.mutate(
      { tableNo: device.tableNo, memo: "", orderMenus: cart },
      {
        onSuccess: () => {
          openModal(ModalName.ORDER_SUCCESS, SuccessModal, {
            title: "주문 완료",
            image: images.COMPLETE_ANIMATION,
            message: "주문이 완료되었습니다.",
            onClose: resetAll,
          });
        },
        onError: (error) => {
          openModal(ModalName.ORDER_ERROR, ErrorModal, {
            title: "주문 실패",
            message: parseErrorMessage(error),
            onClose: closeAllModals,
          });
        },
      }
    );
  };

  return (
    <GestureDetector gesture={gesture}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={[styles.header, styles["header-red"]]}>
              <Text style={styles.headerText}>{store?.name}</Text>
            </View>
            <View style={[styles.header, styles["header-black"]]}>
              <Text style={styles.headerText}>{device?.tableNo}번 테이블</Text>
            </View>
          </View>
          <View style={styles.categoryContainer}>
            <View style={{ width: screenWidth - 210 }}>
              {categories && categories.length > 0 && (
                <FlatList
                  ref={categoriesRef}
                  data={categories}
                  horizontal={true}
                  keyExtractor={(item, index) => `${item.categoryId}-${index}`}
                  contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                  renderItem={(renderItem) => (
                    <CategoryButton
                      category={renderItem.item}
                      index={renderItem.index}
                      selectedCategory={selectedCategory}
                      handleSelectCategory={handleOnChangeCategory}
                    />
                  )}
                />
              )}
            </View>
            <View>
              <Pressable style={styles.countryOfOrigin} onPress={openCountryOfOriginModal}>
                <Text style={styles.countryOfOriginText}>원산지 정보</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {categories && categories.length > 0 && (
              <FlatList
                ref={menusRef}
                data={selectedCategory.menus}
                numColumns={4}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                columnWrapperStyle={{ gap: 16 }}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingBottom: 130,
                }}
                renderItem={(renderItem) => (
                  <MenuCard
                    menu={renderItem.item}
                    rootNumColumns={4}
                    rootGap={16}
                    rootPaddingHorizontal={24}
                    onPress={() => openMenuModalOrAddToCart(renderItem.item)}
                  />
                )}
              />
            )}
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerLeft}>
            <Pressable style={styles.receipt} onPress={openOrderHistoryModal}>
              <ReceiptIcon />
              <Text style={styles.receiptText}>주문 내역</Text>
            </Pressable>
          </View>
          <View style={styles.footerRight}>
            <Pressable style={styles.staffCall} onPress={openStaffCallModal}>
              <BellIcon />
              <Text style={styles.staffCallText}>직원 호출</Text>
            </Pressable>
            <Pressable style={styles.cart} onPress={openCartModal}>
              <Text style={styles.cartText}>장바구니</Text>
              <Text style={styles.cartCountText}>{cart.length}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  header: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  "header-red": {
    backgroundColor: colors.PRIMARY_RED,
  },
  "header-black": {
    backgroundColor: colors.BLACK,
  },
  headerText: {
    fontFamily: fonts.HAKGYOANSIM_DUNGGEUNMISO_BOLD,
    color: colors.WHITE,
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    paddingTop: 16,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  countryOfOrigin: {
    width: 100,
    height: 32,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: colors.PRIMARY_RED,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  countryOfOriginText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 12,
    color: colors.PRIMARY_RED,
  },
  menuContainer: {
    paddingVertical: 12,
  },
  footerContainer: {
    height: 72,
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: "0 -1 12 0 rgba(0, 0, 0, 0.12)",
  },
  footerLeft: {
    flex: 1,
    flexDirection: "row",
  },
  footerRight: {
    flexDirection: "row",
    gap: 12,
  },
  receipt: {
    height: 48,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  receiptText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.GRAY1_33,
  },
  staffCall: {
    height: 48,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.PRIMARY_RED,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  staffCallText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.PRIMARY_RED,
  },
  cart: {
    height: 48,
    flexDirection: "row",
    backgroundColor: colors.PRIMARY_RED,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  cartText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.WHITE,
  },
  cartCountText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.PRIMARY_RED,
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
});

export default CustomerTableScreen;
