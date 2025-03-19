import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { AntDesign } from '@expo/vector-icons'

import { colors, fonts } from '@/constants'
import { Menu, OrderCreate } from '@/types'

interface CartMenuProps {
  index: number
  menu?: Menu
  item: OrderCreate
  addQuantity: (index: number) => void
  minusQuantity: (index: number) => void
  removeItem: (index: number) => void
}

const CartMenu = ({
  index,
  menu,
  item,
  addQuantity,
  minusQuantity,
  removeItem,
}: CartMenuProps) => {
  if (!menu) {
    return null
  }

  const selectedOptions = item.optionGroups.flatMap(group => group.options)
  const findOptions = menu.optionGroups
    .flatMap(group => group.options)
    .filter(menuOption =>
      selectedOptions.some(
        option => option.optionId.toString() === menuOption.id.toString(),
      ),
    )
  const totalPrice =
    (menu.price + findOptions.reduce((acc, option) => acc + option.price, 0)) *
    item.count

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuName}>{menu.name}</Text>
        <Text style={styles.menuPrice}>{menu.price.toPrice()}원</Text>
      </View>
      {findOptions.length > 0 && (
        <View style={{ gap: 4 }}>
          {findOptions.map(option => (
            <View key={String(option.id)} style={styles.menuOptionContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.menuOption}>+ {option.name}</Text>
              </View>
              <Text style={styles.menuOption}>{option.price.toPrice()}원</Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.divider} />
      <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => minusQuantity(index)}
          >
            <AntDesign name="minus" size={24} color="black" />
          </Pressable>
          <Text style={styles.quantityText}>{item.count}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => addQuantity(index)}
          >
            <AntDesign name="plus" size={24} color="black" />
          </Pressable>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <Text style={styles.totalPrice}>{totalPrice.toPrice()}원</Text>
        </View>
      </View>
      <Pressable
        style={{ alignItems: 'flex-end' }}
        onPress={() => removeItem(index)}
      >
        <Text style={styles.removeText}>삭제</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.WHITE,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuName: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
  },
  menuPrice: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 18,
  },
  menuOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuOption: {
    color: colors.BLUE,
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.GRAY7_F1,
    marginTop: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: colors.GRAY7_F1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    paddingHorizontal: 12,
  },
  totalPrice: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 24,
    color: colors.PRIMARY_RED,
  },
  removeText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
    color: colors.PRIMARY_RED,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.PRIMARY_RED,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
})

export default CartMenu
