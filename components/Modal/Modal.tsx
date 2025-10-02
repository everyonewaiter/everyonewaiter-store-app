import React, { PropsWithChildren } from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

interface ModalContainerProps {
  visible: boolean;
  size?: "default" | "large";
  position?: "center" | "right";
}

function ModalContainer({
  visible,
  size = "default",
  position = "center",
  children,
}: PropsWithChildren<ModalContainerProps>) {
  const isRightPosition = position === "right";

  const alignItems = isRightPosition ? "flex-end" : "center";
  const containerStyle = isRightPosition
    ? styles.rightModalContainer
    : size === "large"
      ? styles.largeModalContainer
      : styles.defaultModalContainer;

  return (
    <>
      {visible && (
        <View style={[styles.container, { alignItems }]}>
          <View style={[styles.container, { alignItems }, styles.overlay]}></View>
          <View style={containerStyle}>{children}</View>
        </View>
      )}
    </>
  );
}

interface ModalTitleProps {
  color?: "black" | "red";
  position?: "left" | "center";
  size?: "medium" | "large";
}

function ModalTitle({
  color = "black",
  position = "center",
  size = "large",
  children,
}: PropsWithChildren<ModalTitleProps>) {
  return (
    <View style={position === "center" && styles.titleCenter}>
      <Text style={[styles[`titleText-${size}`], styles[`title-${color}`]]}>{children}</Text>
    </View>
  );
}

interface ModalContentProps {
  image?: string;
}

function ModalContent({ image, children }: PropsWithChildren<ModalContentProps>) {
  return (
    <View style={styles.contentCenter}>
      {image && <Image source={image} style={styles.image} />}
      <Text style={styles.contentText}>{children}</Text>
    </View>
  );
}

function ButtonContainer({ children }: PropsWithChildren) {
  return <View style={styles.buttonContainer}>{children}</View>;
}

interface ModalButtonProps extends PressableProps {
  label: string;
  color?: "red" | "gray" | "black";
  disabled?: boolean;
}

function ModalButton({ label, color = "red", disabled = false, ...props }: ModalButtonProps) {
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
        <Text style={[styles.largeLabel, styles[`${color}LabelText`]]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const Modal = Object.assign(ModalContainer, {
  Title: ModalTitle,
  Content: ModalContent,
  ButtonContainer,
  Button: ModalButton,
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  defaultModalContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    padding: 32,
    width: "50%",
    gap: 24,
  },
  largeModalContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    flexDirection: "row",
    padding: 16,
    width: "80%",
    height: "80%",
    gap: 24,
  },
  rightModalContainer: {
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 24,
    width: "40%",
    height: "100%",
    gap: 12,
  },
  titleCenter: {
    alignItems: "center",
  },
  "titleText-medium": {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 18,
  },
  "titleText-large": {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 32,
  },
  "title-black": {
    color: colors.BLACK,
  },
  "title-red": {
    color: colors.PRIMARY_RED,
  },
  contentCenter: {
    alignItems: "center",
  },
  contentText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
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
    alignItems: "center",
    justifyContent: "center",
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
});

export default Modal;
