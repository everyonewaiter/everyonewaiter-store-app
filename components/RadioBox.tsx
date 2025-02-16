import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import RadioItem from '@/components/RadioBoxItem'

interface RadioBoxProps {
  items: RadioBoxItemProps[]
}

interface RadioBoxItemProps {
  label: string
  value: string
}

const RadioBox = ({ items }: RadioBoxProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(items[0]?.value)

  return (
    <View style={styles.container}>
      {items.map(item => (
        <RadioItem
          key={item.value}
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
