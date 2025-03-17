import { Pressable, StyleSheet, Text } from 'react-native'

import { colors, fonts } from '@/constants'

interface CategoryProps {
  id: bigint
  label: string
  index: number
  selectedCategory: string
  handleSelectCategory: (id: bigint, index: number) => void
}

const Category = ({
  id,
  label,
  index,
  selectedCategory,
  handleSelectCategory,
}: CategoryProps) => {
  return (
    <Pressable
      style={[
        styles.category,
        id.toString() === selectedCategory
          ? styles.selectedCategory
          : styles.notSelectedCategory,
      ]}
      onPress={() => handleSelectCategory(id, index)}
    >
      <Text
        style={[
          styles.categoryText,
          id.toString() === selectedCategory
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
