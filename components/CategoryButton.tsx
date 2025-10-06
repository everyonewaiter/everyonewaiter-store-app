import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { Category } from "@/types/menu";

interface CategoryButtonProps {
  category: Category;
  itemIndex: number;
  selectedCategoryIndex: number;
  handleOnChangeCategoryIndex: (itemIndex: number) => void;
}

const CategoryButton = ({
  category,
  itemIndex,
  selectedCategoryIndex,
  handleOnChangeCategoryIndex,
}: CategoryButtonProps) => {
  const isSelected = itemIndex === selectedCategoryIndex;

  return (
    <Pressable
      style={[styles.category, isSelected ? styles.selectedCategory : styles.notSelectedCategory]}
      onPress={() => handleOnChangeCategoryIndex(itemIndex)}
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
