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
import MenuModal from "@/components/Modal/MenuModal";
import OrderHistoryModal from "@/components/Modal/OrderHistoryModal";
import StaffCallModal from "@/components/Modal/StaffCallModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { milliTimes } from "@/constants/times";
import useCart, { AddCartAction } from "@/hooks/useCart";
import useIdle from "@/hooks/useIdle";
import useInterval from "@/hooks/useInterval";
import { useGetMenus } from "@/hooks/useMenuApi";
import useModal from "@/hooks/useModal";
import { useGetTableOrderHistories } from "@/hooks/useOrderApi";
import { useGetStore } from "@/hooks/useStoreApi";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { ModalName } from "@/stores/modal";
import { Menu } from "@/types/menu";

const CustomerTableScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const { idleTime, resetIdleTime, gesture } = useIdle(milliTimes.THREE_MINUTE);

  const menusRef = useRef<FlatList | null>(null);
  const categoriesRef = useRef<FlatList | null>(null);

  const { device } = useAuthentication();
  const { data: store } = useGetStore(device?.storeId);
  const { allCategories } = useGetMenus(device?.storeId);
  const { histories } = useGetTableOrderHistories(device?.tableNo);
  const { cart, addCart, clearCart } = useCart();

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const { isOpenedModal, openModal, closeAllModals } = useModal();

  const resetAll = useCallback(() => {
    closeAllModals();
    clearCart();
    resetIdleTime();
    setSelectedCategoryIndex(0);

    categoriesRef.current?.scrollToIndex({ index: 0 });
    if (allCategories[0].menus.length > 0) {
      menusRef.current?.scrollToIndex({ index: 0 });
    }
  }, [closeAllModals, clearCart, resetIdleTime, allCategories]);

  useInterval(() => {
    if (
      idleTime.current <= milliTimes.ZERO &&
      (isOpenedModal || cart.length > 0 || selectedCategoryIndex !== 0)
    ) {
      resetAll();
    }
  }, milliTimes.ONE_SECOND);

  useEffect(() => {
    setSelectedCategoryIndex(0);
  }, [allCategories]);

  if (!device || !store) {
    return null;
  }

  const openCountryOfOriginModal = () => {
    openModal(ModalName.COUNTRY_OF_ORIGIN, CountryOfOriginModal, { storeId: store.storeId });
  };

  const openStaffCallModal = () => {
    openModal(ModalName.STAFF_CALL, StaffCallModal, { storeId: store.storeId });
  };

  const openOrderHistoryModal = () => {
    if (histories.length > 0) {
      openModal(ModalName.ORDER_HISTORY, OrderHistoryModal, {
        storeId: store.storeId,
        tableNo: device.tableNo,
      });
    }
  };

  const openMenuModalOrAddToCart = (menu: Menu) => {
    if (store.setting.showMenuPopup || menu.menuOptionGroups.length > 0) {
      openModal(ModalName.MENU, MenuModal, { menu: menu });
    } else {
      addCart[AddCartAction.WITHOUT_OPTION](menu);
    }
  };

  const openCartModal = () => {
    if (cart.length > 0) {
      openModal(ModalName.CART, CartModal, { successCallback: resetAll });
    }
  };

  const handleOnChangeCategoryIndex = (itemIndex: number) => {
    if (itemIndex >= 0 && itemIndex < allCategories.length) {
      setSelectedCategoryIndex(itemIndex);
      categoriesRef.current?.scrollToIndex({ index: itemIndex });
    }
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
              <FlatList
                ref={categoriesRef}
                data={allCategories}
                horizontal={true}
                keyExtractor={(item) => item.categoryId}
                contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                renderItem={(renderItem) => (
                  <CategoryButton
                    category={renderItem.item}
                    itemIndex={renderItem.index}
                    selectedCategoryIndex={selectedCategoryIndex}
                    handleOnChangeCategoryIndex={handleOnChangeCategoryIndex}
                  />
                )}
              />
            </View>
            <View>
              <Pressable style={styles.countryOfOrigin} onPress={openCountryOfOriginModal}>
                <Text style={styles.countryOfOriginText}>원산지 정보</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <FlatList
              ref={menusRef}
              data={allCategories[selectedCategoryIndex].menus}
              numColumns={4}
              keyExtractor={(item) => item.menuId}
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
