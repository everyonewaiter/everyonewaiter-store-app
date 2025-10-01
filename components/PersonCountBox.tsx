import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

interface PersonCountBoxProps {
  icon: ReactNode;
  label: string;
  count: number;
  minusHandler: () => void;
  plusHandler: () => void;
}

const PersonCountBox = ({ icon, label, minusHandler, plusHandler, count }: PersonCountBoxProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={styles.contentText}>{label}</Text>
        </View>
        <View style={styles.rightContent}>
          <Pressable style={styles.button} onPress={minusHandler}>
            <AntDesign name="minus" size={32} color="black" />
          </Pressable>
          <Text style={[styles.contentText, styles.countText]}>{count}</Text>
          <Pressable style={styles.button} onPress={plusHandler}>
            <AntDesign name="plus" size={32} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: colors.GRAY5_E7,
    borderBottomWidth: 0.5,
    paddingVertical: 24,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  rightContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  contentText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 32,
    fontWeight: "600",
  },
  countText: {
    paddingHorizontal: 24,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.GRAY7_F1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PersonCountBox;
