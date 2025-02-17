import React from 'react'
import { StyleSheet, View } from 'react-native'

import RadioItem from '@/components/RadioBoxItem'

interface RadioBoxProps<T> {
  items: RadioBoxItemProps<T>[]
  selectedItem: string
  setSelectedItem: React.Dispatch<React.SetStateAction<T>>
}

interface RadioBoxItemProps<T> {
  label: string
  value: T
}

const RadioBox = <T,>({
  items,
  selectedItem,
  setSelectedItem,
}: RadioBoxProps<T>) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <RadioItem
          key={`${item.value}-${index}`}
          label={item.label}
          selected={selectedItem === item.value}
          onPress={() => setSelectedItem(item.value)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
})

export default RadioBox
