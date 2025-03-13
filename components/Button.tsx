import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'

import { colors, fonts } from '@/constants'

interface ButtonProps extends PressableProps {
  label: string
  variant?: 'fill' | 'outline'
  color?: 'red' | 'gray' | 'black'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const Button = ({
  label,
  variant = 'fill',
  color = 'red',
  size = 'large',
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        styles[size],
        styles[`${variant}-${color}`],
        pressed && styles[`${variant}Pressed`],
        disabled && styles.disabled,
      ]}
      {...props}
    >
      <View style={styles.labelContainer}>
        <Text
          style={[styles[`label-${variant}-${color}`], styles[`label-${size}`]]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingVertical: 7,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 9.5,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 12.5,
    paddingHorizontal: 24,
  },
  'fill-red': {
    backgroundColor: colors.PRIMARY_RED,
  },
  'outline-red': {
    borderColor: colors.PRIMARY_RED,
    borderWidth: 1,
  },
  'fill-gray': {
    backgroundColor: colors.GRAY7_F7,
  },
  'outline-gray': {
    borderColor: colors.GRAY5_DA,
    borderWidth: 1,
  },
  'fill-black': {
    backgroundColor: colors.GRAY0_22,
  },
  'outline-black': {
    borderColor: colors.GRAY0_22,
    borderWidth: 1,
  },
  fillPressed: {
    opacity: 0.9,
  },
  outlinePressed: {
    opacity: 0.7,
  },
  labelContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'label-small': {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
  },
  'label-medium': {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 14,
  },
  'label-large': {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 15,
  },
  'label-fill-red': {
    color: colors.WHITE,
  },
  'label-fill-gray': {
    color: colors.BLACK,
  },
  'label-fill-black': {
    color: colors.WHITE,
  },
  'label-outline-red': {
    color: colors.PRIMARY_RED,
  },
  'label-outline-gray': {
    color: colors.GRAY2_55,
  },
  'label-outline-black': {
    color: colors.GRAY0_22,
  },
  disabled: {
    opacity: 0.6,
  },
})

export default Button
