import { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'

import { BellIcon } from '@/assets/icons/BellIcon'
import { ReceiptIcon } from '@/assets/icons/ReceiptIcon'
import Category from '@/components/Category'
import CountryOfOriginModal from '@/components/CountryOfOriginModal'
import Menu from '@/components/Menu'
import { colors, fonts } from '@/constants'
import { useGetStore } from '@/hooks'

const storeName = '나루 레스토랑'
const tableNo = 1
const categories = [
  { id: 0, name: '전체' },
  { id: 1, name: '카테고리1' },
  { id: 2, name: '카테고리2' },
  { id: 3, name: '카테고리3' },
  { id: 4, name: '카테고리4' },
  { id: 5, name: '카테고리5' },
  { id: 6, name: '카테고리6' },
  { id: 7, name: '카테고리7' },
  { id: 8, name: '카테고리8' },
  { id: 9, name: '카테고리9' },
  { id: 10, name: '카테고리10' },
  { id: 11, name: '카테고리11' },
  { id: 12, name: '카테고리12' },
  { id: 13, name: '카테고리13' },
  { id: 14, name: '카테고리14' },
]
const menus = [
  {
    id: BigInt(1),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴1',
    price: BigInt(10000),
  },
  {
    id: BigInt(2),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴2',
    price: BigInt(8800),
  },
  {
    id: BigInt(3),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴3',
    price: BigInt(30000),
  },
  {
    id: BigInt(4),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴4',
    price: BigInt(30000),
  },
  {
    id: BigInt(5),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴5',
    price: BigInt(30000),
  },
  {
    id: BigInt(6),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴6',
    price: BigInt(30000),
  },
  {
    id: BigInt(7),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴7',
    price: BigInt(30000),
  },
  {
    id: BigInt(8),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴8',
    price: BigInt(30000),
  },
  {
    id: BigInt(9),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴9',
    price: BigInt(30000),
  },
  {
    id: BigInt(10),
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpwmrbKbttK8TgNRmIijBAHo1DN59jnAgG0g&s',
    name: '메뉴10',
    price: BigInt(30000),
  },
]

const CustomerTableScreen = () => {
  const { width: screenWidth } = useWindowDimensions()

  // Store
  const { data: store } = useGetStore()

  // Category
  const categoriesRef = useRef<FlatList | null>(null)
  const [categoryContentWidth, setCategoryContentWidth] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  // Modal
  const [isVisibleCountryOfOriginModal, setIsVisibleCountryOfOriginModal] =
    useState(false)

  useEffect(() => {
    setCategoryContentWidth(screenWidth - 210)
  }, [screenWidth])

  const handleSelectCategory = (label: string, index: number) => {
    setSelectedCategory(label)
    categoriesRef.current?.scrollToIndex({ index })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={[styles.header, styles['header-red']]}>
            <Text style={styles.headerText}>{storeName}</Text>
          </View>
          <View style={[styles.header, styles['header-black']]}>
            <Text style={styles.headerText}>{tableNo}번 테이블</Text>
          </View>
        </View>
        <View style={styles.categoryContainer}>
          <View style={{ width: categoryContentWidth }}>
            <FlatList
              ref={categoriesRef}
              data={categories}
              horizontal={true}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
              renderItem={renderItem => (
                <Category
                  label={renderItem.item.name}
                  index={renderItem.index}
                  selectedCategory={selectedCategory}
                  handleSelectCategory={handleSelectCategory}
                />
              )}
            />
          </View>
          <View>
            <Pressable
              style={styles.countryOfOrigin}
              onPress={() => setIsVisibleCountryOfOriginModal(true)}
            >
              <Text style={styles.countryOfOriginText}>원산지 정보</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.menuContainer}>
          <FlatList
            data={menus}
            numColumns={4}
            keyExtractor={item => String(item.id)}
            columnWrapperStyle={{ gap: 16 }}
            contentContainerStyle={{
              gap: 16,
              paddingHorizontal: 24,
              paddingBottom: 130,
            }}
            renderItem={renderItem => (
              <Menu
                image={renderItem.item.image}
                name={renderItem.item.name}
                price={renderItem.item.price}
                rootNumColumns={4}
                rootGap={16}
                rootPaddingHorizontal={24}
              />
            )}
          />
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          <Pressable style={styles.receipt}>
            <ReceiptIcon />
            <Text style={styles.receiptText}>주문 내역</Text>
          </Pressable>
        </View>
        <View style={styles.footerRight}>
          <Pressable style={styles.staffCall}>
            <BellIcon />
            <Text style={styles.staffCallText}>직원 호출</Text>
          </Pressable>
          <Pressable style={styles.cart}>
            <Text style={styles.cartText}>장바구니</Text>
            <Text style={styles.cartCountText}>3</Text>
          </Pressable>
        </View>
      </View>
      <CountryOfOriginModal
        isVisible={isVisibleCountryOfOriginModal}
        countryOfOrigins={store?.countryOfOrigins ?? []}
        close={() => setIsVisibleCountryOfOriginModal(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  header: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  'header-red': {
    backgroundColor: colors.PRIMARY_RED,
  },
  'header-black': {
    backgroundColor: colors.BLACK,
  },
  headerText: {
    fontFamily: fonts.HAKGYOANSIM_DUNGGEUNMISO_BOLD,
    color: colors.WHITE,
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  countryOfOrigin: {
    width: 100,
    height: 32,
    borderWidth: 1,
    borderRadius: 40,
    borderColor: colors.PRIMARY_RED,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryOfOriginText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 12,
    color: colors.PRIMARY_RED,
  },
  menuContainer: {
    paddingVertical: 12,
  },
  footerContainer: {
    height: 72,
    backgroundColor: colors.WHITE,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: '0 -1 12 0 rgba(0, 0, 0, 0.12)',
  },
  footerLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  footerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  receipt: {
    height: 48,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.GRAY5_E7,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  receiptText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.GRAY1_33,
  },
  staffCall: {
    height: 48,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.PRIMARY_RED,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  staffCallText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.PRIMARY_RED,
  },
  cart: {
    height: 48,
    flexDirection: 'row',
    backgroundColor: colors.PRIMARY_RED,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  cartText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.WHITE,
  },
  cartCountText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 16,
    color: colors.PRIMARY_RED,
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingHorizontal: 8,
  },
})

export default CustomerTableScreen
