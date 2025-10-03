import { FlatList, StyleSheet, Text, View } from "react-native";

import Modal, { BaseModalProps } from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { CountryOfOrigin } from "@/types/store";

export interface CountryOfOriginModalProps extends BaseModalProps {
  countryOfOrigins: CountryOfOrigin[];
  onClose: () => void;
}

const CountryOfOriginModal = ({ countryOfOrigins, onClose }: CountryOfOriginModalProps) => {
  return (
    <Modal>
      <Modal.Title color="black" size="medium" position="left">
        원산지
      </Modal.Title>
      <View>
        <View style={styles.subjectContainer}>
          <View style={styles.center}>
            <Text style={styles.subjectText}>품목</Text>
          </View>
          <View style={styles.center}>
            <Text style={styles.subjectText}>원산지</Text>
          </View>
        </View>
        <FlatList
          style={{ height: 300 }}
          data={countryOfOrigins}
          keyExtractor={(item, index) => `${item.item}-${item.origin}-${index}`}
          renderItem={(renderItem) => (
            <View style={styles.contentContainer}>
              <View style={styles.center}>
                <Text style={styles.contentText}>{renderItem.item.item}</Text>
              </View>
              <View style={styles.center}>
                <Text style={styles.contentText}>{renderItem.item.origin}</Text>
              </View>
            </View>
          )}
        />
      </View>
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={onClose} />
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
});

export default CountryOfOriginModal;
