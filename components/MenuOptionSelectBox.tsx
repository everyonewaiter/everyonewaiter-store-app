import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RadioOffIcon, RadioOnIcon } from "@/assets/icons";
import { colors } from "@/constants/colors";
import { MenuOptionGroupType } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import { MenuOption } from "@/types/menu";
import { OrderCreateOptionGroup } from "@/types/order";
import { formatPriceText } from "@/utils/format";

interface MenuOptionSelectBoxProps {
  menuOptionGroupId: string;
  type: keyof typeof MenuOptionGroupType;
  menuOptions: MenuOption[];
  selectedMenuOptionGroups: OrderCreateOptionGroup[];
  setSelectedMenuOptionGroups: React.Dispatch<React.SetStateAction<OrderCreateOptionGroup[]>>;
}

const MenuOptionSelectBox = ({
  menuOptionGroupId,
  type,
  menuOptions,
  selectedMenuOptionGroups,
  setSelectedMenuOptionGroups,
}: MenuOptionSelectBoxProps) => {
  const isSelectedOption = (menuOption: MenuOption) => {
    return selectedMenuOptionGroups
      .filter(
        (selectedMenuOptionGroup) => selectedMenuOptionGroup.menuOptionGroupId === menuOptionGroupId
      )
      .flatMap((selectedMenuOptionGroup) => selectedMenuOptionGroup.orderOptions)
      .some(
        (selectedOrderOption) =>
          selectedOrderOption.name === menuOption.name &&
          selectedOrderOption.price === menuOption.price
      );
  };

  const handleOnSelectOption = (menuOption: MenuOption) => {
    const copy = [...selectedMenuOptionGroups];
    const selectedMenuOptionGroupIndex = copy.findIndex(
      (selectedMenuOptionGroup) => selectedMenuOptionGroup.menuOptionGroupId === menuOptionGroupId
    );

    if (selectedMenuOptionGroupIndex === -1) {
      copy.push({
        menuOptionGroupId: menuOptionGroupId,
        orderOptions: [{ name: menuOption.name, price: menuOption.price }],
      });
    } else {
      const selectedMenuOptionGroup = copy[selectedMenuOptionGroupIndex];

      if (type === "MANDATORY") {
        selectedMenuOptionGroup.orderOptions = [{ name: menuOption.name, price: menuOption.price }];
      } else {
        const selectedOrderOptions = selectedMenuOptionGroup.orderOptions;
        const selectedOrderOptionIndex = selectedOrderOptions.findIndex(
          (selectedOrderOption) =>
            selectedOrderOption.name === menuOption.name &&
            selectedOrderOption.price === menuOption.price
        );

        if (selectedOrderOptionIndex === -1) {
          selectedOrderOptions.push({ name: menuOption.name, price: menuOption.price });
        } else {
          selectedOrderOptions.splice(selectedOrderOptionIndex, 1);
        }

        if (selectedOrderOptions.length === 0) {
          copy.splice(selectedMenuOptionGroupIndex, 1);
        }
      }
    }

    copy.sort((a, b) => a.menuOptionGroupId.localeCompare(b.menuOptionGroupId));
    copy.forEach((orderOptionGroup) =>
      orderOptionGroup.orderOptions.sort((a, b) => a.name.localeCompare(b.name))
    );

    setSelectedMenuOptionGroups(copy);
  };

  return (
    <View style={styles.container}>
      {menuOptions.map((menuOption, index) => (
        <Pressable
          key={`${menuOption.name}-${menuOption.price}-${index}`}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onPress={() => handleOnSelectOption(menuOption)}
        >
          {isSelectedOption(menuOption) ? <RadioOnIcon /> : <RadioOffIcon />}
          <Text style={styles.text}>{menuOption.name}</Text>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.text}>{formatPriceText(menuOption.price)}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  text: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
    color: colors.GRAY1_33,
  },
});

export default MenuOptionSelectBox;
