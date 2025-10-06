import { FlatList, StyleSheet, Text, View } from "react-native";

import Modal from "@/components/Modal/Modal";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import useModal from "@/hooks/useModal";
import { useGetTableOrderHistories } from "@/hooks/useOrderApi";
import { useGetStore } from "@/hooks/useStoreApi";
import { Order, OrderOption, OrderOptionGroup } from "@/types/order";

export interface OrderHistoryModalProps {
  storeId: string;
  tableNo: number;
}

const OrderHistoryModal = ({ storeId, tableNo }: OrderHistoryModalProps) => {
  const { data: store } = useGetStore(storeId);
  const { histories } = useGetTableOrderHistories(tableNo);

  const { closeAllModals } = useModal();

  if (!store) return null;

  const getOrderOptionsWithGroupId = (
    orderOptionGroups: OrderOptionGroup[]
  ): (OrderOption & { orderOptionGroupId: string })[] => {
    return orderOptionGroups.flatMap((orderOptionGroup) =>
      orderOptionGroup.orderOptions.map((orderOption) => ({
        ...orderOption,
        orderOptionGroupId: orderOptionGroup.orderOptionGroupId,
      }))
    );
  };

  const calculateOrdersTotalPrice = (orders: Order[]) => {
    let totalPrice = 0;
    for (const order of orders) {
      totalPrice += calculateOrderTotalPrice(order);
    }
    return totalPrice;
  };

  const calculateOrderTotalPrice = (order: Order) => {
    return order.orderMenus.reduce((acc, menu) => {
      const optionPrice = menu.orderOptionGroups
        .flatMap((group) => group.orderOptions)
        .reduce((acc, option) => acc + option.price, 0);
      return acc + (menu.price + optionPrice) * menu.quantity;
    }, 0);
  };

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
          renderItem={({ item: order, index }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={styles.indexNumber}>{index + 1}</Text>
              <View style={styles.orderContainer}>
                {order.orderMenus.map((orderMenu) => (
                  <View key={`${order.orderId}-${orderMenu.orderMenuId}`} style={{ flex: 1 }}>
                    <View style={[styles.spaceBetween]}>
                      <Text style={styles.menuName}>{orderMenu.name}</Text>
                      <Text style={styles.menuName}>{orderMenu.quantity}개</Text>
                    </View>
                    {getOrderOptionsWithGroupId(orderMenu.orderOptionGroups).map((orderOption) => (
                      <Text
                        key={`${orderOption.orderOptionGroupId}-${orderOption.name}`}
                        style={styles.menuOption}
                      >
                        + {orderOption.name}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      </View>
      {store.setting.showOrderTotalPrice && (
        <View style={[styles.spaceBetween, { alignItems: "center" }]}>
          <Text style={styles.totalPriceText}>총 주문 금액</Text>
          <Text style={styles.totalPrice}>{calculateOrdersTotalPrice(histories).toPrice()}원</Text>
        </View>
      )}
      <Modal.ButtonContainer>
        <Modal.Button label="확인" onPress={closeAllModals} />
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
