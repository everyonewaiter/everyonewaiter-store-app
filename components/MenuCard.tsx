import React, { useEffect, useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { ImageBackground, useImage } from "expo-image";

import Badge from "@/components/Badge";
import SoldOut from "@/components/SoldOut";
import { colors, fonts } from "@/constants";
import { Menu } from "@/types";

interface MenuCardProps extends PressableProps {
  menu: Menu;
  rootNumColumns: number;
  rootGap: number;
  rootPaddingHorizontal: number;
}

const MenuCard = ({
  menu,
  rootNumColumns,
  rootGap,
  rootPaddingHorizontal,
  ...props
}: MenuCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  const image = useImage(process.env.EXPO_PUBLIC_CDN_URL + `/${menu.image}`);

  useEffect(() => {
    const paddingHorizontalSpace = rootPaddingHorizontal * 2;
    const columnGapSpace = rootGap * (rootNumColumns - 1);
    const availableSpace = screenWidth - paddingHorizontalSpace - columnGapSpace;
    setContentWidth(availableSpace / rootNumColumns);
  }, [screenWidth, rootGap, rootNumColumns, rootPaddingHorizontal]);

  const isSoldOut = menu.state === "SOLD_OUT";

  return (
    <Pressable style={[styles.container, { width: contentWidth }]} disabled={isSoldOut} {...props}>
      <View style={styles.imageContainer}>
        {image && (
          <ImageBackground
            style={[styles.image, isSoldOut && styles.soldOutImage]}
            imageStyle={styles.imageBorder}
            source={image}
            alt={menu.name}
            contentFit="cover"
          >
            {menu.label !== "DEFAULT" && !isSoldOut && <Badge label={menu.label} />}
          </ImageBackground>
        )}
        {isSoldOut && <SoldOut />}
      </View>
      <View style={[styles.textContainer, isSoldOut && styles.soldOutText]}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.menuName}>{menu.name}</Text>
          {menu.spicy > 0 && <Text style={styles.menuSpicy}> {"🌶".repeat(menu.spicy)}</Text>}
        </View>
        <Text style={styles.menuPrice}>{menu.price.toPrice()}원</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 290,
    backgroundColor: colors.WHITE,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
  },
  imageContainer: {
    flex: 3,
    borderBottomWidth: 1,
    borderColor: colors.GRAY5_E7,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageBorder: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuName: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 15,
  },
  menuSpicy: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
  },
  menuPrice: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    fontWeight: "600",
  },
  soldOutImage: {
    backgroundColor: colors.BLACK,
    opacity: 0.4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  soldOutText: {
    backgroundColor: colors.BLACK,
    opacity: 0.4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default MenuCard;
