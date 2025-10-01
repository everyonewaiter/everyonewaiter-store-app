import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import { colors, fonts } from "@/constants";

interface DevicePurposeSelectBoxProps extends PressableProps {
  label: string;
  selected: boolean;
}

const DevicePurposeSelectBox = ({ label, selected, ...props }: DevicePurposeSelectBoxProps) => {
  return (
    <Pressable style={[styles.container, selected && styles.selectedContainer]} {...props}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 111,
    height: 115,
    borderWidth: 1,
    borderColor: colors.GRAY5_E7,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedContainer: {
    borderColor: colors.PRIMARY_RED,
  },
  label: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    fontWeight: "500",
  },
  selectedLabel: {
    color: colors.PRIMARY_RED,
  },
});

export default DevicePurposeSelectBox;
