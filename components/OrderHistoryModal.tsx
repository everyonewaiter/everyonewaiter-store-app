import { FlatList, StyleSheet, Text, View } from 'react-native'

import { Modal } from '@/components/Modal'
import { colors, fonts } from '@/constants'
import { Order, Setting } from '@/types'

interface OrderHistoryModalProps {
  isVisible: boolean
  histories: Order[]
  setting?: Setting
  close: () => void
}

const OrderHistoryModal = ({
  isVisible,
  histories,
  setting,
  close,
}: OrderHistoryModalProps) => {
  const calculateTotalPrice = () => {
    let totalPrice = 0
    for (const history of histories) {
      totalPrice += history.menus.reduce((acc, menu) => {
        const optionPrice = menu.optionGroups
          .flatMap(group => group.options)
          .reduce((acc, option) => acc + option.price, 0)
        return acc + (menu.price + optionPrice) * menu.count
      }, 0)
    }
    return totalPrice
  }

  return (
    <Modal visible={isVisible}>
      <Modal.Container>
        <Modal.Title color="black" size="medium" position="left">
          주문 내역
        </Modal.Title>
        <View>
          <FlatList
            style={{ height: 300 }}
            data={histories}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={{ gap: 14 }}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Text style={styles.indexNumber}>{index + 1}</Text>
                <View style={styles.orderContainer}>
                  {item.menus.map(menu => (
                    <View key={`${item.id}-${menu.id}`} style={{ flex: 1 }}>
                      <View style={[styles.spaceBetween]}>
                        <Text style={styles.menuName}>{menu.name}</Text>
                        <Text style={styles.menuName}>{menu.count}개</Text>
                      </View>
                      {menu.optionGroups
                        .flatMap(group => group.options)
                        .map(option => (
                          <Text
                            key={String(option.id)}
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
          <View style={[styles.spaceBetween, { alignItems: 'center' }]}>
            <Text style={styles.totalPriceText}>총 주문 금액</Text>
            <Text style={styles.totalPrice}>
              {calculateTotalPrice().toPrice()}원
            </Text>
          </View>
        )}
        <Modal.ButtonContainer>
          <Modal.Button label="확인" onPress={close} />
        </Modal.ButtonContainer>
      </Modal.Container>
    </Modal>
  )
}

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    backgroundColor: colors.GRAY7_F1,
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: '600',
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
})

export default OrderHistoryModal
