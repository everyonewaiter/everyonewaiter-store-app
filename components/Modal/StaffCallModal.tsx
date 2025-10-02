import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import Modal from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

interface StaffCallModalProps {
  isVisible: boolean;
  options: string[];
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  submit: () => void;
  close: () => void;
}

const numColumns = 4;
const gap = 12;

const StaffCallModal = ({
  isVisible,
  options,
  selectedOption,
  setSelectedOption,
  submit,
  close,
}: StaffCallModalProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const modalWidth = screenWidth * 0.5;
    const paddingHorizontalSpace = 32 * 2;
    const columnGapSpace = gap * (numColumns - 1);
    const availableSpace = modalWidth - paddingHorizontalSpace - columnGapSpace;
    setContentWidth(availableSpace / numColumns);
  }, [screenWidth]);

  return (
    <Modal visible={isVisible}>
      <Modal.Title color="black" size="medium" position="left">
        직원 호출
      </Modal.Title>
      <FlatList
        data={options}
        numColumns={numColumns}
        keyExtractor={(item, index) => `${item}-${index}`}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ gap }}
        renderItem={(renderItem) => (
          <Pressable
            style={[
              styles.staffCallOption,
              { width: contentWidth },
              selectedOption === renderItem.item && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(renderItem.item)}
          >
            <View style={styles.center}>
              <Text style={styles.staffCallOptionText}>{renderItem.item}</Text>
            </View>
          </Pressable>
        )}
      />
      <Modal.ButtonContainer>
        <Modal.Button label="닫기" color="gray" onPress={close} />
        <Modal.Button label="호출하기" color="black" disabled={!selectedOption} onPress={submit} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  subjectContainer: {
    height: 48,
    flexDirection: "row",
    backgroundColor: colors.GRAY7_F1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 15,
  },
  contentContainer: {
    height: 48,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.GRAY5_E7,
  },
  contentText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 14,
  },
  staffCallOption: {
    height: 118,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.GRAY5_E7,
  },
  selectedOption: {
    borderColor: colors.PRIMARY_RED,
  },
  staffCallOptionText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 15,
  },
});

export default StaffCallModal;
