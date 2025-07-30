import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { RadioOffIcon, RadioOnIcon } from '@/assets/icons'
import { colors, fonts, MenuOptionGroupType } from '@/constants'
import { MenuOption, OrderCreateOptionGroup } from '@/types'
import { formatPriceText } from '@/utils'

interface MenuOptionSelectBoxProps {
  groupId: string
  type: keyof typeof MenuOptionGroupType
  options: MenuOption[]
  selectedOptions: OrderCreateOptionGroup[]
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<OrderCreateOptionGroup[]>
  >
}

const MenuOptionSelectBox = ({
  groupId,
  type,
  options,
  selectedOptions,
  setSelectedOptions,
}: MenuOptionSelectBoxProps) => {
  const isSelectedOption = (option: MenuOption) => {
    const selectedOption = selectedOptions.find(
      option => option.menuOptionGroupId === groupId,
    )
    if (!selectedOption) {
      return false
    }
    return selectedOption.orderOptions.some(
      selectedOption =>
        selectedOption.name === option.name &&
        selectedOption.price === option.price,
    )
  }

  const handleSelectOption = (option: MenuOption) => {
    const copy = [...selectedOptions]
    const index = copy.findIndex(option => option.menuOptionGroupId === groupId)
    if (index === -1) {
      copy.push({
        menuOptionGroupId: groupId,
        orderOptions: [{ name: option.name, price: option.price }],
      })
    } else {
      if (type === 'MANDATORY') {
        copy[index].orderOptions = [{ name: option.name, price: option.price }]
      } else {
        const optionIndex = copy[index].orderOptions.findIndex(
          selectedOption =>
            selectedOption.name === option.name &&
            selectedOption.price === option.price,
        )
        if (optionIndex === -1) {
          copy[index].orderOptions.push({
            name: option.name,
            price: option.price,
          })
        } else {
          copy[index].orderOptions.splice(optionIndex, 1)
        }
        if (copy[index].orderOptions.length === 0) {
          copy.splice(index, 1)
        }
      }
    }

    copy.sort((a, b) =>
      a.menuOptionGroupId < b.menuOptionGroupId
        ? -1
        : a.menuOptionGroupId > b.menuOptionGroupId
          ? 1
          : 0,
    )
    copy.forEach(group =>
      group.orderOptions.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
      ),
    )
    setSelectedOptions(copy)
  }

  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={`${option.name}-${option.price}-${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onPress={() => handleSelectOption(option)}
        >
          {isSelectedOption(option) ? <RadioOnIcon /> : <RadioOffIcon />}
          <Text style={styles.text}>{option.name}</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.text}>{formatPriceText(option.price)}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  text: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 16,
    color: colors.GRAY1_33,
  },
})

export default MenuOptionSelectBox
