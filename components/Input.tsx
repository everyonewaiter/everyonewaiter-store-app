import { ForwardedRef, forwardRef, useRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import InputLabel from "@/components/InputLabel";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { mergeRefs } from "@/utils/support";

interface InputProps extends TextInputProps {
  label?: string;
  right?: string;
  error?: string;
  disabled?: boolean;
}

const Input = (
  { label, right, error, disabled = false, ...props }: InputProps,
  ref?: ForwardedRef<TextInput>
) => {
  const innerRef = useRef<TextInput | null>(null);
  const hasError = Boolean(error);

  return (
    <Pressable onPress={() => innerRef.current?.focus()}>
      <View>
        {Boolean(label) && <InputLabel label={label!} disabled={disabled} />}
        <View
          style={[
            styles.inputContainer,
            hasError && styles.inputErrorContainer,
            disabled && styles.inputDisabledContainer,
          ]}
        >
          <TextInput
            ref={ref ? mergeRefs(innerRef, ref) : innerRef}
            style={[styles.input, hasError && styles.inputError, disabled && styles.inputDisabled]}
            placeholderTextColor={colors.GRAY3_99}
            editable={!disabled}
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
            {...props}
          />
          {Boolean(right) && <Text style={styles.inputRight}>{right}</Text>}
        </View>
      </View>
      {hasError && (
        <View style={styles.errorTextContainer}>
          <MaterialCommunityIcons name="information-outline" size={20} color={colors.PRIMARY_RED} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
    paddingVertical: 9.5,
    paddingHorizontal: 16,
  },
  inputErrorContainer: {
    borderColor: colors.STATUS_ERROR,
  },
  inputDisabledContainer: {
    backgroundColor: colors.GRAY7_F7,
  },
  input: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 14,
    color: colors.BLACK,
    padding: 0,
  },
  inputError: {
    color: colors.GRAY2_55,
  },
  inputDisabled: {
    color: colors.GRAY3_99,
  },
  inputRight: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 14,
    color: colors.GRAY2_55,
    position: "absolute",
    right: 12,
    top: "50%",
  },
  errorTextContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  errorText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
    color: colors.STATUS_ERROR,
    marginLeft: 4,
  },
});

export default forwardRef(Input);
