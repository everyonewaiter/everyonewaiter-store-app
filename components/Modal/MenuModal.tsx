import React, { useEffect, useMemo, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";

import { ImageBackground, useImage } from "expo-image";

import { AntDesign } from "@expo/vector-icons";

import Button from "@/components/Button";
import MenuOptionSelectBox from "@/components/MenuOptionSelectBox";
import Modal from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { MenuLabel } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import useCart, { AddCartAction } from "@/hooks/useCart";
import useModal from "@/hooks/useModal";
import { Menu } from "@/types/menu";
import { OrderCreateOptionGroup } from "@/types/order";

export interface MenuModalProps {
  menu: Menu;
}

const MenuModal = ({ menu }: MenuModalProps) => {
  const image = useImage(process.env.EXPO_PUBLIC_CDN_URL + `/${menu.image}`);

  const { addCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedMenuOptionGroups, setSelectedMenuOptionGroups] = useState<
    OrderCreateOptionGroup[]
  >([]);

  const { closeAllModals } = useModal();

  const menuOptionGroups = useMemo(
    () => [
      {
        title: "필수 옵션",
        data: menu.menuOptionGroups.filter(
          (menuOptionGroup) => menuOptionGroup.type === "MANDATORY"
        ),
      },
      {
        title: "선택 옵션",
        data: menu.menuOptionGroups.filter(
          (menuOptionGroup) => menuOptionGroup.type === "OPTIONAL"
        ),
      },
    ],
    [menu]
  );

  useEffect(() => {
    const initMandatoryMenuOptionGroups = menuOptionGroups[0].data.map((menuOptionGroup) => ({
      menuOptionGroupId: menuOptionGroup.menuOptionGroupId,
      orderOptions: [
        {
          name: menuOptionGroup.menuOptions[0].name,
          price: menuOptionGroup.menuOptions[0].price,
        },
      ],
    }));

    setSelectedMenuOptionGroups(initMandatoryMenuOptionGroups);
  }, [menu, menuOptionGroups]);

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const calculateTotalPrice = () => {
    const selectedMenuOptionsPrice = selectedMenuOptionGroups
      .flatMap((selectedMenuOptionGroup) => selectedMenuOptionGroup.orderOptions)
      .reduce((acc, orderOption) => acc + orderOption.price, 0);

    const totalPrice = (menu.price + selectedMenuOptionsPrice) * quantity;

    return totalPrice.toPrice();
  };

  const handleOnSubmit = () => {
    addCart[AddCartAction.WITH_OPTION](menu, quantity, selectedMenuOptionGroups);
  };

  const handleOnClose = () => {
    closeAllModals();
  };

  return (
    <Modal size="large">
      <View style={styles.imageContainer}>
        {image && (
          <ImageBackground
            style={styles.image}
            imageStyle={styles.imageBorder}
            source={image}
            alt={menu.name}
            contentFit="cover"
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.info}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoLabel}>{MenuLabel[menu.label]}</Text>
              <Pressable style={styles.closeButton} onPress={handleOnClose}>
                <AntDesign name="close" size={28} color="black" />
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTitleText}>{menu.name}</Text>
              {menu.spicy > 0 && (
                <Text style={styles.infoDescriptionText}> {"🌶".repeat(menu.spicy)}</Text>
              )}
            </View>
            {menu.description && <Text style={styles.infoDescriptionText}>{menu.description}</Text>}
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable style={styles.quantityButton} onPress={minusQuantity}>
                  <AntDesign name="minus" size={32} color="black" />
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable style={styles.quantityButton} onPress={addQuantity}>
                  <AntDesign name="plus" size={32} color="black" />
                </Pressable>
              </View>
              <View style={styles.menuPrice}>
                <Text style={styles.menuPriceText}>{menu.price.toPrice()}원</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <SectionList
              style={{ height: menu.description ? 320 : 360 }}
              sections={menuOptionGroups}
              keyExtractor={(item) => item.menuOptionGroupId}
              renderItem={({ item }) => (
                <View style={styles.optionGroupContainer}>
                  <View style={styles.optionGroup}>
                    <Text style={styles.optionGroupTitle}>{item.name}</Text>
                    <MenuOptionSelectBox
                      menuOptionGroupId={item.menuOptionGroupId}
                      type={item.type}
                      menuOptions={item.menuOptions}
                      selectedMenuOptionGroups={selectedMenuOptionGroups}
                      setSelectedMenuOptionGroups={setSelectedMenuOptionGroups}
                    />
                  </View>
                </View>
              )}
              renderSectionHeader={({ section: { title, data } }) =>
                data.length > 0 ? (
                  title === "필수 옵션" ? (
                    <View style={styles.rowCenter}>
                      <Text style={styles.optionTypeText}>필수 옵션</Text>
                      <Text style={[styles.optionTypeText, styles.redText]}> *</Text>
                    </View>
                  ) : (
                    <Text style={styles.optionTypeText}>선택 옵션</Text>
                  )
                ) : null
              }
              renderSectionFooter={({ section: { data } }) =>
                data.length > 0 ? <View style={styles.thinDivider} /> : null
              }
            />
          </View>
        </View>
        <Button label={`총 ${calculateTotalPrice()}원 | 메뉴 담기`} onPress={handleOnSubmit} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageBorder: {
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
    gap: 16,
  },
  info: {
    gap: 12,
  },
  infoLabel: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.PRIMARY_RED,
    color: colors.PRIMARY_RED,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  infoTitleText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 28,
    fontWeight: "600",
  },
  infoDescriptionText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 20,
  },
  closeButton: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  divider: {
    height: 8,
    backgroundColor: colors.GRAY7_F1,
    marginVertical: 4,
  },
  thinDivider: {
    height: 1,
    backgroundColor: colors.GRAY7_F1,
    marginTop: 4,
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.GRAY7_F1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 24,
    paddingHorizontal: 12,
  },
  menuPrice: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  menuPriceText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 32,
  },
  optionGroupContainer: {
    gap: 12,
    marginBottom: 12,
  },
  optionGroup: {
    backgroundColor: colors.GRAY7_F1,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    gap: 12,
  },
  optionGroupTitle: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
  },
  optionTypeText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  redText: {
    color: colors.PRIMARY_RED,
  },
});

export default MenuModal;
