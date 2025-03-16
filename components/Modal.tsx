import React, { PropsWithChildren } from 'react'
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native'

import { colors, fonts } from '@/constants'

interface MainModalProps {
  visible: boolean
}

const MainModal = ({
  visible,
  children,
}: PropsWithChildren<MainModalProps>) => {
  return (
    <>
      {visible && (
        <View style={styles.container}>
          <View style={[styles.container, styles.overlay]}></View>
          {children}
        </View>
      )}
    </>
  )
}

const Container = ({ children }: PropsWithChildren) => {
  return <View style={styles.modalContainer}>{children}</View>
}

interface TitleProps {
  color?: 'black' | 'red'
  position?: 'left' | 'center'
  size?: 'medium' | 'large'
}

const Title = ({
  color = 'black',
  position = 'center',
  size = 'large',
  children,
}: PropsWithChildren<TitleProps>) => {
  return (
    <View style={position === 'center' && styles.titleCenter}>
      <Text style={[styles[`titleText-${size}`], styles[`title-${color}`]]}>
        {children}
      </Text>
    </View>
  )
}

const Content = ({ children }: PropsWithChildren) => {
  return (
    <View style={styles.contentCenter}>
      <Text style={styles.contentText}>{children}</Text>
    </View>
  )
}

const ButtonContainer = ({ children }: PropsWithChildren) => {
  return <View style={styles.buttonContainer}>{children}</View>
}

interface ButtonProps extends PressableProps {
  label: string
  color?: 'red' | 'gray' | 'black'
  disabled?: boolean
}

const Button = ({
  label,
  color = 'red',
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.largeButton,
        styles[`${color}Button`],
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
      {...props}
    >
      <View style={styles.labelContainer}>
        <Text style={[styles.largeLabel, styles[`${color}LabelText`]]}>
          {label}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    padding: 32,
    width: '50%',
    gap: 24,
  },
  titleCenter: {
    alignItems: 'center',
  },
  'titleText-medium': {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 18,
  },
  'titleText-large': {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 32,
  },
  'title-black': {
    color: colors.BLACK,
  },
  'title-red': {
    color: colors.PRIMARY_RED,
  },
  contentCenter: {
    alignItems: 'center',
  },
  contentText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  largeButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12.5,
    paddingHorizontal: 24,
  },
  redButton: {
    backgroundColor: colors.PRIMARY_RED,
  },
  grayButton: {
    backgroundColor: colors.GRAY7_F1,
  },
  blackButton: {
    backgroundColor: colors.GRAY0_22,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeLabel: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 15,
  },
  redLabelText: {
    color: colors.WHITE,
  },
  grayLabelText: {
    color: colors.BLACK,
  },
  blackLabelText: {
    color: colors.WHITE,
  },
})

export const Modal = Object.assign(MainModal, {
  Container,
  Title,
  Content,
  ButtonContainer,
  Button,
})
