import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import ErrorModal from "@/components/Modal/ErrorModal";
import Modal from "@/components/Modal/Modal";
import SuccessModal from "@/components/Modal/SuccessModal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { images } from "@/constants/images";
import useModal from "@/hooks/useModal";
import { useStaffCall } from "@/hooks/useOrderApi";
import { useGetStore } from "@/hooks/useStoreApi";
import { ModalName } from "@/stores/modal";
import { parseErrorMessage } from "@/utils/support";

export interface StaffCallModalProps {
  storeId: string;
}

const numColumns = 4;
const gap = 12;

const StaffCallModal = ({ storeId }: StaffCallModalProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);

  const { data: store } = useGetStore(storeId);
  const [selectedStaffCallOption, setSelectedStaffCallOption] = useState("");

  const { openModal, closeAllModals } = useModal();
  const { mutate, isPending } = useStaffCall();

  useEffect(() => {
    const modalWidth = screenWidth * 0.5;
    const paddingHorizontalSpace = 32 * 2;
    const columnGapSpace = gap * (numColumns - 1);
    const availableSpace = modalWidth - paddingHorizontalSpace - columnGapSpace;
    setContentWidth(availableSpace / numColumns);
  }, [screenWidth]);

  if (!store) return null;

  const handleOnClose = () => {
    setSelectedStaffCallOption("");
    closeAllModals();
  };

  const handleOnSubmit = () => {
    if (selectedStaffCallOption) {
      mutate(
        { optionName: selectedStaffCallOption },
        {
          onSuccess: () => {
            openModal(ModalName.STAFF_CALL_SUCCESS, SuccessModal, {
              title: selectedStaffCallOption,
              image: images.BELL_ANIMATION,
              message: "직원을 호출했습니다. 잠시만 기다려주세요!",
              onClose: () => {
                setSelectedStaffCallOption("");
                closeAllModals();
              },
            });
          },
          onError: (error) => {
            openModal(ModalName.STAFF_CALL_ERROR, ErrorModal, {
              title: "직원 호출 실패",
              message: parseErrorMessage(error),
              onClose: closeAllModals,
            });
          },
        }
      );
    }
  };

  return (
    <Modal>
      <Modal.Title color="black" size="medium" position="left">
        직원 호출
      </Modal.Title>
      <FlatList
        data={store.setting.staffCallOptions}
        numColumns={numColumns}
        keyExtractor={(item, index) => `${item}-${index}`}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ gap }}
        renderItem={(renderItem) => (
          <Pressable
            style={[
              styles.staffCallOption,
              { width: contentWidth },
              selectedStaffCallOption === renderItem.item && styles.selectedOption,
            ]}
            onPress={() => setSelectedStaffCallOption(renderItem.item)}
          >
            <View style={styles.center}>
              <Text style={styles.staffCallOptionText}>{renderItem.item}</Text>
            </View>
          </Pressable>
        )}
      />
      <Modal.ButtonContainer>
        <Modal.Button label="닫기" color="gray" onPress={handleOnClose} />
        <Modal.Button
          label="호출하기"
          color="black"
          disabled={!selectedStaffCallOption || isPending}
          onPress={handleOnSubmit}
        />
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
