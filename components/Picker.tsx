import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Picker as NativePicker } from '@react-native-picker/picker'

import { colors, fonts } from '@/constants'

interface PickerProps {
  items: PickerItemProps[]
}

interface PickerItemProps {
  label: string
  value: string
}

const Picker = ({ items }: PickerProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(items[0]?.value)

  return (
    <View style={styles.container}>
      <NativePicker
        selectedValue={selectedItem}
        onValueChange={setSelectedItem}
      >
        {items.map(item => (
          <NativePicker.Item
            key={item.value}
            style={styles.pickerItem}
            label={item.label}
            value={item.value}
          />
        ))}
      </NativePicker>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
    justifyContent: 'center',
  },
  pickerItem: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 14,
  },
})

export default Picker
