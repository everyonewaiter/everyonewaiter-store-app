import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

import { colors, fonts } from "@/constants";

interface PaymentTypeSelectBoxProps extends PressableProps {
  label: string;
  selected: boolean;
}

const PaymentTypeSelectBox = ({ label, selected, ...props }: PaymentTypeSelectBoxProps) => {
  return (
    <Pressable style={[styles.container, selected && styles.selectedContainer]} {...props}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.GRAY5_E7,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedContainer: {
    borderColor: colors.PRIMARY_RED,
  },
  label: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 15,
    fontWeight: "500",
  },
  selectedLabel: {
    color: colors.PRIMARY_RED,
  },
});

export default PaymentTypeSelectBox;
