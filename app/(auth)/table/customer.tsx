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
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

import { Image } from 'expo-image'

import { BellIcon } from '@/assets/icons/BellIcon'
import { ReceiptIcon } from '@/assets/icons/ReceiptIcon'
import Category from '@/components/Category'
import CountryOfOriginModal from '@/components/CountryOfOriginModal'
import ErrorModal from '@/components/ErrorModal'
import Menu from '@/components/Menu'
import { Modal } from '@/components/Modal'
import StaffCallModal from '@/components/StaffCallModal'
import { colors, fonts, milliTimes } from '@/constants'
import { useGetDevice, useGetSetting, useGetStore, useStaffCall } from '@/hooks'
import { parseErrorMessage } from '@/utils'

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
  const { device } = useGetDevice()
  const [idleTime, setIdleTime] = useState(milliTimes.ONE_MINUTE)

  // Store
  const { data: store } = useGetStore()
  const { data: setting } = useGetSetting()

  // Category
  const categoriesRef = useRef<FlatList | null>(null)
  const [categoryContentWidth, setCategoryContentWidth] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('전체')

  // Order
  const staffCall = useStaffCall()
  const [selectedStaffCallOption, setSelectedStaffCallOption] = useState('')

  // Modal
  const [isVisibleCountryOfOriginModal, setIsVisibleCountryOfOriginModal] =
    useState(false)
  const [isVisibleStaffCallModal, setIsVisibleStaffCallModal] = useState(false)
  const [isVisibleStaffCallSuccessModal, setIsVisibleStaffCallSuccessModal] =
    useState(false)
  const [isVisibleErrorModal, setIsVisibleErrorModal] = useState(false)
  const [error, setError] = useState({
    title: '',
    message: '',
  })

  useEffect(() => {
    setCategoryContentWidth(screenWidth - 210)
  }, [screenWidth])

  useEffect(() => {
    const interval = setInterval(() => {
      setIdleTime(prev => prev - milliTimes.ONE_SECOND)
    }, milliTimes.ONE_SECOND)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (idleTime <= milliTimes.ZERO) {
      resetAll()
    }
  }, [idleTime])

  const resetIdleTime = Gesture.Tap().onStart(() => {
    if (idleTime < milliTimes.ONE_MINUTE) {
      runOnJS(setIdleTime)(milliTimes.ONE_MINUTE)
    }
  })

  const handleSelectCategory = (label: string, index: number) => {
    setSelectedCategory(label)
    categoriesRef.current?.scrollToIndex({ index })
  }

  const handleSelectStaffCallOption = (option: string) => {
    setSelectedStaffCallOption(option)
  }

  const closeStaffCallModal = () => {
    setSelectedStaffCallOption('')
    setIsVisibleStaffCallModal(false)
  }

  const callStaff = () => {
    if (!selectedStaffCallOption) {
      return
    }

    setIsVisibleStaffCallModal(false)
    staffCall.mutate(
      { callOption: selectedStaffCallOption },
      {
        onSuccess: () => {
          setIsVisibleStaffCallSuccessModal(true)
        },
        onError: error => {
          setError({
            title: '직원 호출 실패',
            message: parseErrorMessage(error),
          })
          setIsVisibleErrorModal(true)
        },
      },
    )
  }

  const resetAll = () => {
    setSelectedCategory('전체')
    setSelectedStaffCallOption('')
    setIsVisibleCountryOfOriginModal(false)
    setIsVisibleStaffCallModal(false)
    setIsVisibleStaffCallSuccessModal(false)
    setIsVisibleErrorModal(false)
    setError({ title: '', message: '' })
  }

  return (
    <GestureDetector gesture={resetIdleTime}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={[styles.header, styles['header-red']]}>
              <Text style={styles.headerText}>{store?.name}</Text>
            </View>
            <View style={[styles.header, styles['header-black']]}>
              <Text style={styles.headerText}>{device?.tableNo}번 테이블</Text>
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
            <Pressable
              style={styles.staffCall}
              onPress={() => setIsVisibleStaffCallModal(true)}
            >
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
        <StaffCallModal
          isVisible={isVisibleStaffCallModal}
          staffCallOptions={setting?.staffCallOptions ?? []}
          selectedStaffCallOption={selectedStaffCallOption}
          handleSelect={handleSelectStaffCallOption}
          submit={callStaff}
          close={closeStaffCallModal}
        />
        <Modal visible={isVisibleStaffCallSuccessModal}>
          <Modal.Container>
            <Modal.Title color="black" size="medium" position="left">
              {selectedStaffCallOption}
            </Modal.Title>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('@/assets/images/bell-animation.gif')}
                style={{ width: 100, height: 100 }}
              />
              <Text
                style={{
                  fontFamily: fonts.PRETENDARD_REGULAR,
                  fontSize: 20,
                }}
              >
                직원을 호출했습니다. 잠시만 기다려주세요!
              </Text>
            </View>
            <Modal.ButtonContainer>
              <Modal.Button
                label="확인"
                onPress={() => {
                  setSelectedStaffCallOption('')
                  setIsVisibleStaffCallSuccessModal(false)
                }}
              />
            </Modal.ButtonContainer>
          </Modal.Container>
        </Modal>
        <ErrorModal
          isVisible={isVisibleErrorModal}
          title={error.title}
          message={error.message}
          close={() => {
            setError({ title: '', message: '' })
            setIsVisibleErrorModal(false)
          }}
        />
      </SafeAreaView>
    </GestureDetector>
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
