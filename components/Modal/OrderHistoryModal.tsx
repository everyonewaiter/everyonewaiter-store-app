import { FlatList, StyleSheet, Text, View } from "react-native";

import Modal, { BaseModalProps } from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Order } from "@/types/order";
import { Setting } from "@/types/store";
import { calculateOrdersTotalPrice } from "@/utils/calculate";

export interface OrderHistoryModalProps extends BaseModalProps {
  histories: Order[];
  setting?: Setting;
}

const OrderHistoryModal = ({ histories, setting, onClose }: OrderHistoryModalProps) => {
  return (
    <Modal>
      <Modal.Title color="black" size="medium" position="left">
        주문 내역
      </Modal.Title>
      <View>
        <FlatList
          style={{ height: 300 }}
          data={histories}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={{ gap: 14 }}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={styles.indexNumber}>{index + 1}</Text>
              <View style={styles.orderContainer}>
                {item.orderMenus.map((menu, index) => (
                  <View key={`${item.orderId}-${menu.orderMenuId}-${index}`} style={{ flex: 1 }}>
                    <View style={[styles.spaceBetween]}>
                      <Text style={styles.menuName}>{menu.name}</Text>
                      <Text style={styles.menuName}>{menu.quantity}개</Text>
                    </View>
                    {menu.orderOptionGroups
                      .flatMap((group) => group.orderOptions)
                      .map((option, index) => (
                        <Text
                          key={`${option.name}-${option.price}-${index}`}
                          style={styles.menuOption}
                        >
                          + {option.name}
                        </Text>
                      ))}
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      </View>
      {setting?.showOrderTotalPrice && (
        <View style={[styles.spaceBetween, { alignItems: "center" }]}>
          <Text style={styles.totalPriceText}>총 주문 금액</Text>
          <Text style={styles.totalPrice}>{calculateOrdersTotalPrice(histories).toPrice()}원</Text>
        </View>
      )}
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={onClose} />
      </Modal.ButtonContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    backgroundColor: colors.GRAY7_F1,
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuOption: {
    color: colors.BLUE,
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
  },
  menuName: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
  },
  indexNumber: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: colors.PRIMARY_RED,
    borderRadius: 6,
    color: colors.WHITE,
    paddingHorizontal: 6,
  },
  totalPriceText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.PRIMARY_RED,
  },
  totalPrice: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 28,
    color: colors.PRIMARY_RED,
  },
});

export default OrderHistoryModal;
