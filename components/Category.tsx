import { Pressable, StyleSheet, Text } from 'react-native'

import { colors, fonts } from '@/constants'

interface CategoryProps {
  label: string
  index: number
  selectedCategory: string
  handleSelectCategory: (label: string, index: number) => void
}

const Category = ({
  label,
  index,
  selectedCategory,
  handleSelectCategory,
}: CategoryProps) => {
  return (
    <Pressable
      style={[
        styles.category,
        label === selectedCategory
          ? styles.selectedCategory
          : styles.notSelectedCategory,
      ]}
      onPress={() => handleSelectCategory(label, index)}
    >
      <Text
        style={[
          styles.categoryText,
          label === selectedCategory
            ? styles.selectedCategoryText
            : styles.notSelectedCategoryText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  category: {
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
  },
  selectedCategory: {
    backgroundColor: colors.GRAY0_22,
  },
  selectedCategoryText: {
    color: colors.WHITE,
  },
  notSelectedCategory: {
    borderColor: colors.GRAY5_DA,
  },
  notSelectedCategoryText: {
    color: colors.GRAY2_55,
  },
})

export default Category
