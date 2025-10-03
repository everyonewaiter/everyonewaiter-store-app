import React, { useEffect, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";

import { ImageBackground, useImage } from "expo-image";

import { AntDesign } from "@expo/vector-icons";

import Button from "@/components/Button";
import MenuOptionSelectBox from "@/components/MenuOptionSelectBox";
import Modal, { BaseModalProps } from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { MenuLabel } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import { Menu } from "@/types/menu";
import { OrderCreate, OrderCreateOptionGroup } from "@/types/order";

export interface MenuModalProps extends BaseModalProps {
  selectedMenu: Menu | null;
  cart: OrderCreate[];
  setCart: React.Dispatch<React.SetStateAction<OrderCreate[]>>;
}

const MenuModal = ({ selectedMenu, cart, setCart, onClose }: MenuModalProps) => {
  const image = useImage(
    selectedMenu?.image
      ? process.env.EXPO_PUBLIC_CDN_URL + `/${selectedMenu.image}`
      : images.PREPARATION
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<OrderCreateOptionGroup[]>([]);

  useEffect(() => {
    if (selectedMenu) {
      setSelectedOptions(
        selectedMenu.menuOptionGroups
          .filter((optionGroup) => optionGroup.type === "MANDATORY")
          .map((optionGroup) => ({
            menuOptionGroupId: optionGroup.menuOptionGroupId,
            orderOptions: [
              {
                name: optionGroup.menuOptions[0].name,
                price: optionGroup.menuOptions[0].price,
              },
            ],
          }))
      );
    }
  }, [selectedMenu]);

  if (!selectedMenu) {
    return null;
  }

  const mandatoryOptionGroups = selectedMenu.menuOptionGroups.filter(
    (optionGroup) => optionGroup.type === "MANDATORY"
  );
  const choiceOptionGroups = selectedMenu.menuOptionGroups.filter(
    (optionGroup) => optionGroup.type === "OPTIONAL"
  );
  const optionGroups = [
    { title: "필수 옵션", data: mandatoryOptionGroups },
    { title: "선택 옵션", data: choiceOptionGroups },
  ];

  const handleClose = () => {
    setQuantity(1);
    setSelectedOptions([]);
    onClose();
  };

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const calculateTotalPrice = () => {
    const options = selectedOptions.flatMap((optionGroup) => optionGroup.orderOptions);
    const optionPrice = options.reduce((acc, option) => {
      const selectedOption = selectedMenu.menuOptionGroups
        .flatMap((optionGroup) => optionGroup.menuOptions)
        .find((menuOption) => menuOption.name === option.name && menuOption.price === option.price);
      return acc + (selectedOption?.price ?? 0);
    }, 0);
    const totalPrice = (selectedMenu.price + optionPrice) * quantity;
    return totalPrice.toPrice();
  };

  const addCart = () => {
    const copy = [...cart];
    const index = copy
      .filter((c) => c.menuId === selectedMenu.menuId)
      .findIndex((item) => compareOptionGroups(item.menuOptionGroups, selectedOptions));
    if (index === -1) {
      copy.push({
        menuId: selectedMenu.menuId,
        quantity: quantity,
        menuOptionGroups: selectedOptions,
      });
    } else {
      copy[index].quantity += quantity;
    }
    setCart(copy);
    handleClose();
  };

  const compareOptionGroups = (
    groups1: OrderCreateOptionGroup[],
    groups2: OrderCreateOptionGroup[]
  ) => {
    if (groups1.length !== groups2.length) {
      return false;
    }

    for (let i = 0; i < groups1.length; i++) {
      const group1 = groups1[i];
      const group2 = groups2[i];
      if (!compareOptionGroup(group1, group2)) {
        return false;
      }
    }

    return true;
  };

  const compareOptionGroup = (group1: OrderCreateOptionGroup, group2: OrderCreateOptionGroup) => {
    if (group1.menuOptionGroupId !== group2.menuOptionGroupId) {
      return false;
    }

    if (group1.orderOptions.length !== group2.orderOptions.length) {
      return false;
    }

    for (let i = 0; i < group1.orderOptions.length; i++) {
      const option1 = group1.orderOptions[i];
      const option2 = group2.orderOptions[i];
      if (option1.name !== option2.name || option1.price !== option2.price) {
        return false;
      }
    }

    return true;
  };

  return (
    <Modal size="large">
      <View style={styles.imageContainer}>
        {image && (
          <ImageBackground
            style={styles.image}
            imageStyle={styles.imageBorder}
            source={image}
            alt={selectedMenu.name}
            contentFit="cover"
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.info}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoLabel}>{MenuLabel[selectedMenu.label]}</Text>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <AntDesign name="close" size={28} color="black" />
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.infoTitleText}>{selectedMenu.name}</Text>
              {selectedMenu.spicy > 0 && (
                <Text style={styles.infoDescriptionText}> {"🌶".repeat(selectedMenu.spicy)}</Text>
              )}
            </View>
            {selectedMenu.description && (
              <Text style={styles.infoDescriptionText}>{selectedMenu.description}</Text>
            )}
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
                <Text style={styles.menuPriceText}>{selectedMenu.price.toPrice()}원</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <SectionList
              style={{ height: selectedMenu.description ? 320 : 360 }}
              sections={optionGroups}
              keyExtractor={(item) => item.menuOptionGroupId}
              renderItem={({ item }) => (
                <View style={styles.optionGroupContainer}>
                  <View style={styles.optionGroup}>
                    <Text style={styles.optionGroupTitle}>{item.name}</Text>
                    <MenuOptionSelectBox
                      groupId={item.menuOptionGroupId}
                      type={item.type}
                      options={item.menuOptions}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
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
        <Button label={`총 ${calculateTotalPrice()}원 | 메뉴 담기`} onPress={addCart} />
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
