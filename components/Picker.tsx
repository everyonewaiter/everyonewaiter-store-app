import React from "react";
import { StyleSheet, View } from "react-native";

import { Picker as NativePicker } from "@react-native-picker/picker";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";

interface PickerProps {
  items: PickerItemProps[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

interface PickerItemProps {
  label: string;
  value: string;
}

const Picker = ({ items, selectedItem, setSelectedItem }: PickerProps) => {
  return (
    <View style={styles.container}>
      <NativePicker selectedValue={selectedItem} onValueChange={setSelectedItem}>
        {items.map((item) => (
          <NativePicker.Item
            key={item.value}
            style={styles.pickerItem}
            label={item.label}
            value={item.value}
          />
        ))}
      </NativePicker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
    paddingLeft: 8,
    justifyContent: "center",
  },
  pickerItem: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 14,
  },
});

export default Picker;
