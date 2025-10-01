import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fonts } from "@/constants";
import { Category } from "@/types";

interface CategoryButtonProps {
  index: number;
  category: Category;
  selectedCategory: Category | null;
  handleSelectCategory: (category: Category, index: number) => void;
}

const CategoryButton = ({
  index,
  category,
  selectedCategory,
  handleSelectCategory,
}: CategoryButtonProps) => {
  const isSelected = category.categoryId === selectedCategory?.categoryId;

  return (
    <Pressable
      style={[styles.category, isSelected ? styles.selectedCategory : styles.notSelectedCategory]}
      onPress={() => handleSelectCategory(category, index)}
    >
      <Text
        style={[
          styles.categoryText,
          isSelected ? styles.selectedCategoryText : styles.notSelectedCategoryText,
        ]}
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  category: {
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
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
});

export default CategoryButton;
