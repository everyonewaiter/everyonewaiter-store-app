import React, { useEffect, useState } from 'react'
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import { ImageBackground, useImage } from 'expo-image'

import Badge from '@/components/Badge'
import { colors, fonts, images, MenuLabel } from '@/constants'
import { Category, Menu } from '@/types'

interface MenuCardProps extends PressableProps {
  menu: Menu
  selectedCategory: Category
  rootNumColumns: number
  rootGap: number
  rootPaddingHorizontal: number
}

const MenuCard = ({
  menu,
  selectedCategory,
  rootNumColumns,
  rootGap,
  rootPaddingHorizontal,
  ...props
}: MenuCardProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const [contentWidth, setContentWidth] = useState(0)
  const image = useImage(menu.imageUri ?? images.PREPARATION)

  useEffect(() => {
    const paddingHorizontalSpace = rootPaddingHorizontal * 2
    const columnGapSpace = rootGap * (rootNumColumns - 1)
    const availableSpace = screenWidth - paddingHorizontalSpace - columnGapSpace
    setContentWidth(availableSpace / rootNumColumns)
  }, [screenWidth, rootGap, rootNumColumns, rootPaddingHorizontal])

  const selectedCategoryId = selectedCategory.id.toString()
  const menuCategoryId = menu.categoryId.toString()
  const isVisible =
    selectedCategoryId === '0' || menuCategoryId === selectedCategoryId

  return (
    <Pressable
      style={[
        styles.container,
        { width: contentWidth },
        !isVisible && styles.hide,
      ]}
      disabled={!isVisible}
      {...props}
    >
      <View style={styles.imageContainer}>
        {image && (
          <ImageBackground
            style={styles.image}
            imageStyle={styles.imageBorder}
            source={image}
            alt={menu.name}
            contentFit="cover"
          >
            {menu.label !== MenuLabel.DEFAULT && <Badge label={menu.label} />}
          </ImageBackground>
        )}
      </View>
      <View style={styles.textContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.menuName}>{menu.name}</Text>
          {menu.spicy > 0 && (
            <Text style={styles.menuSpicy}> {'🌶'.repeat(menu.spicy)}</Text>
          )}
        </View>
        <Text style={styles.menuPrice}>{menu.price.toPrice()}원</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 290,
    backgroundColor: colors.WHITE,
    borderWidth: 1.5,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
  },
  hide: {
    display: 'none',
  },
  imageContainer: {
    flex: 3,
    borderBottomWidth: 1,
    borderColor: colors.GRAY5_E7,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageBorder: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuName: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 15,
  },
  menuSpicy: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 13,
  },
  menuPrice: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    fontWeight: '600',
  },
})

export default MenuCard
