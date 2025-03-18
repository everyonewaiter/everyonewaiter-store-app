import { useCallback, useEffect, useRef, useState } from 'react'
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

import { BellIcon } from '@/assets/icons/BellIcon'
import { ReceiptIcon } from '@/assets/icons/ReceiptIcon'
import CategoryButton from '@/components/CategoryButton'
import CountryOfOriginModal from '@/components/CountryOfOriginModal'
import ErrorModal from '@/components/ErrorModal'
import MenuCard from '@/components/MenuCard'
import StaffCallModal from '@/components/StaffCallModal'
import SuccessModal from '@/components/SuccessModal'
import { colors, defaultCategory, fonts, images, milliTimes } from '@/constants'
import {
  useGetCategories,
  useGetDevice,
  useGetMenus,
  useGetSetting,
  useGetStore,
  useModal,
  useStaffCall,
} from '@/hooks'
import { Category } from '@/types'
import { parseErrorMessage } from '@/utils'

const CustomerTableScreen = () => {
  // Common
  const { width: screenWidth } = useWindowDimensions()
  const { device } = useGetDevice()
  const [idleTime, setIdleTime] = useState(milliTimes.ONE_MINUTE)
  const [error, setError] = useState({ title: '', message: '' })

  // Store
  const { data: store } = useGetStore()
  const { data: setting } = useGetSetting()

  // CategoryButton
  const { categories } = useGetCategories()
  const categoriesRef = useRef<FlatList | null>(null)
  const [categoryContentWidth, setCategoryContentWidth] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)

  // Menu
  const { menus } = useGetMenus()
  const menusRef = useRef<FlatList | null>(null)

  // Order
  const staffCall = useStaffCall()
  const [selectedStaffCallOption, setSelectedStaffCallOption] = useState('')

  // Modal
  const countryOfOriginModal = useModal()
  const staffCallModal = useModal()
  const staffCallSuccessModal = useModal()
  const errorModal = useModal()

  const resetAll = useCallback(() => {
    setIdleTime(milliTimes.ONE_MINUTE)
    setError({ title: '', message: '' })
    setSelectedCategory(defaultCategory)
    setSelectedStaffCallOption('')
    countryOfOriginModal.close()
    staffCallModal.close()
    staffCallSuccessModal.close()
    errorModal.close()
    categoriesRef.current?.scrollToIndex({ index: 0 })
    menusRef.current?.scrollToIndex({ index: 0 })
  }, [countryOfOriginModal, errorModal, staffCallModal, staffCallSuccessModal])

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
  }, [idleTime, resetAll])

  const resetIdleTime = Gesture.Tap().onStart(() => {
    if (idleTime < milliTimes.ONE_MINUTE) {
      runOnJS(setIdleTime)(milliTimes.ONE_MINUTE)
    }
  })

  const filterMenus = () => {
    if (!menus) {
      return []
    }
    if (selectedCategory.id.toString() === '0') {
      return menus
    }
    return menus.filter(
      menu => menu.categoryId.toString() === selectedCategory.id.toString(),
    )
  }

  const callStaff = () => {
    if (selectedStaffCallOption) {
      staffCallModal.close()
      staffCall.mutate(
        { callOption: selectedStaffCallOption },
        {
          onSuccess: () => {
            staffCallSuccessModal.open()
          },
          onError: error => {
            setError({
              title: '직원 호출 실패',
              message: parseErrorMessage(error),
            })
            errorModal.open()
          },
        },
      )
    }
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
              {categories && categories.length > 0 && (
                <FlatList
                  ref={categoriesRef}
                  data={categories}
                  horizontal={true}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                  renderItem={renderItem => (
                    <CategoryButton
                      category={renderItem.item}
                      index={renderItem.index}
                      selectedCategory={selectedCategory}
                      handleSelectCategory={(category: Category, index) => {
                        setSelectedCategory(category)
                        categoriesRef.current?.scrollToIndex({ index })
                      }}
                    />
                  )}
                />
              )}
            </View>
            <View>
              <Pressable
                style={styles.countryOfOrigin}
                onPress={countryOfOriginModal.open}
              >
                <Text style={styles.countryOfOriginText}>원산지 정보</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menus && menus.length > 0 && (
              <FlatList
                ref={menusRef}
                data={filterMenus()}
                numColumns={4}
                keyExtractor={item => String(item.id)}
                columnWrapperStyle={{ gap: 16 }}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingBottom: 130,
                }}
                renderItem={renderItem => (
                  <MenuCard
                    menu={renderItem.item}
                    rootNumColumns={4}
                    rootGap={16}
                    rootPaddingHorizontal={24}
                  />
                )}
              />
            )}
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
            <Pressable style={styles.staffCall} onPress={staffCallModal.open}>
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
          isVisible={countryOfOriginModal.isOpen}
          countryOfOrigins={store?.countryOfOrigins ?? []}
          close={countryOfOriginModal.close}
        />
        <StaffCallModal
          isVisible={staffCallModal.isOpen}
          options={setting?.staffCallOptions ?? []}
          selectedOption={selectedStaffCallOption}
          setSelectedOption={setSelectedStaffCallOption}
          submit={callStaff}
          close={() => {
            setSelectedStaffCallOption('')
            staffCallModal.close()
          }}
        />
        <SuccessModal
          isVisible={staffCallSuccessModal.isOpen}
          title={selectedStaffCallOption}
          image={images.BELL_ANIMATION}
          message="직원을 호출했습니다. 잠시만 기다려주세요!"
          close={() => {
            setSelectedStaffCallOption('')
            staffCallSuccessModal.close()
          }}
        />
        <ErrorModal
          isVisible={errorModal.isOpen}
          title={error.title}
          message={error.message}
          close={() => {
            setError({ title: '', message: '' })
            errorModal.close()
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
