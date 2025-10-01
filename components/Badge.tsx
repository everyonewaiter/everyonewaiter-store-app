import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import { MenuLabel } from "@/constants/domain";
import { fonts } from "@/constants/fonts";

interface BadgeProps {
  label: keyof typeof MenuLabel;
}

const Badge = ({ label }: BadgeProps) => {
  const color = label === "BEST" ? colors.ORANGE : colors.PRIMARY_RED;

  return (
    <View style={styles.container}>
      <Text style={[styles.badge, { backgroundColor: color }]}>{MenuLabel[label]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
    paddingTop: 6,
    paddingRight: 4,
  },
  badge: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.WHITE,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

export default Badge;
