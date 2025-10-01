import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

import { colors, fonts } from "@/constants";

interface NumPadProps extends PressableProps {
  label: number | "back" | "reset";
  positionX: "left" | "center" | "right";
  positionY: "top" | "center" | "bottom";
}

const NumPad = ({ label, positionX, positionY, ...props }: NumPadProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        styles[`border-${positionX}-${positionY}`],
        pressed && styles.pressed,
      ]}
      {...props}
    >
      {typeof label === "number" && <Text style={styles.label}>{label}</Text>}
      {label === "reset" && <FontAwesome6 name="arrows-rotate" size={32} color={colors.GRAY3_99} />}
      {label === "back" && <FontAwesome6 name="arrow-left" size={32} color={colors.GRAY3_99} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    borderColor: colors.GRAY5_E7,
    alignItems: "center",
    justifyContent: "center",
  },
  "border-left-top": {
    borderTopLeftRadius: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  "border-center-top": {
    borderWidth: 2,
  },
  "border-right-top": {
    borderTopRightRadius: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  "border-left-center": {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  "border-center-center": {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  "border-right-center": {
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  "border-left-bottom": {
    borderBottomLeftRadius: 16,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  "border-center-bottom": {
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  "border-right-bottom": {
    borderBottomRightRadius: 16,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  label: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 40,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default NumPad;
