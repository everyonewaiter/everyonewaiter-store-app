import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { RadioOffIcon, RadioOnIcon } from '@/assets/icons'
import { colors, fonts, MenuOptionGroupType } from '@/constants'
import { MenuOption, OrderCreateOptionGroup, valueOf } from '@/types'
import { formatPriceText } from '@/utils'

interface MenuOptionSelectBoxProps {
  groupId: bigint
  type: valueOf<typeof MenuOptionGroupType>
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
      option => option.groupId.toString() === groupId.toString(),
    )
    if (!selectedOption) {
      return false
    }
    return selectedOption.options.some(
      selectedOption =>
        selectedOption.optionId.toString() === option.id.toString(),
    )
  }

  const handleSelectOption = (option: MenuOption) => {
    const copy = [...selectedOptions]
    const index = copy.findIndex(
      option => option.groupId.toString() === groupId.toString(),
    )
    if (index === -1) {
      copy.push({ groupId, options: [{ optionId: option.id }] })
    } else {
      if (type === MenuOptionGroupType.MANDATORY) {
        copy[index].options = [{ optionId: option.id }]
      } else {
        const optionIndex = copy[index].options.findIndex(
          selectedOption =>
            selectedOption.optionId.toString() === option.id.toString(),
        )
        if (optionIndex === -1) {
          copy[index].options.push({ optionId: option.id })
        } else {
          copy[index].options.splice(optionIndex, 1)
        }
        if (copy[index].options.length === 0) {
          copy.splice(index, 1)
        }
      }
    }

    copy.sort((a, b) => Number(a.groupId - b.groupId))
    copy.forEach(group =>
      group.options.sort((a, b) => Number(a.optionId - b.optionId)),
    )
    setSelectedOptions(copy)
  }

  return (
    <View style={styles.container}>
      {options.map(option => (
        <Pressable
          key={String(option.id)}
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
