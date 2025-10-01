import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";

interface LogoProps {
  size?: "small" | "medium" | "large";
  direction?: "row" | "column";
}

const Logo = ({ size = "large", direction = "column" }: LogoProps) => {
  return (
    <View style={[styles.container, styles[`${direction}Direction`]]}>
      <Image style={styles[`${size}Image`]} source={images.LOGO} />
      <Text style={[styles.logoText, styles[`${size}Text`]]}>모두의 웨이터</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  columnDirection: {
    gap: 11.46,
  },
  rowDirection: {
    flexDirection: "row",
    gap: 12,
  },
  smallImage: {
    width: 24,
    height: 24,
  },
  mediumImage: {
    width: 40,
    height: 40,
  },
  largeImage: {
    width: 62,
    height: 60,
  },
  logoText: {
    color: colors.PRIMARY_RED,
    fontFamily: fonts.HAKGYOANSIM_DUNGGEUNMISO_BOLD,
  },
  smallText: {
    fontSize: 18,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
  },
});

export default Logo;
