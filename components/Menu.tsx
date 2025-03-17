import { useEffect, useState } from 'react'
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import { ImageBackground } from 'expo-image'

import { colors, fonts } from '@/constants'

interface MenuProps extends PressableProps {
  image: string
  name: string
  price: bigint
  rootNumColumns: number
  rootGap: number
  rootPaddingHorizontal: number
}

const Menu = ({
  image,
  name,
  price,
  rootNumColumns,
  rootGap,
  rootPaddingHorizontal,
  ...props
}: MenuProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const [contentWidth, setContentWidth] = useState(0)

  useEffect(() => {
    const paddingHorizontalSpace = rootPaddingHorizontal * 2
    const columnGapSpace = rootGap * (rootNumColumns - 1)
    const availableSpace = screenWidth - paddingHorizontalSpace - columnGapSpace
    setContentWidth(availableSpace / rootNumColumns)
  }, [screenWidth, rootGap, rootNumColumns, rootPaddingHorizontal])

  return (
    <Pressable style={[styles.container, { width: contentWidth }]} {...props}>
      <View style={styles.imageContainer}>
        <ImageBackground
          style={styles.image}
          imageStyle={styles.imageBorder}
          source={{ uri: image }}
          alt={name}
          contentFit="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.menuName}>{name}</Text>
        <Text style={styles.menuPrice}>{BigInt(price).toPrice()}원</Text>
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
  menuPrice: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 20,
    fontWeight: '600',
  },
})

export default Menu
