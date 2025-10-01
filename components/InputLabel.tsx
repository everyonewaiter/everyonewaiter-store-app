import { StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

interface InputLabelProps {
  label: string;
  disabled?: boolean;
}

const InputLabel = ({ label, disabled = false }: InputLabelProps) => {
  return <Text style={[styles.label, disabled && styles.disabled]}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
    color: colors.GRAY1_33,
    marginBottom: 6,
  },
  disabled: {
    color: colors.GRAY3_99,
  },
});

export default InputLabel;
