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
import CartModal from '@/components/CartModal'
import CategoryButton from '@/components/CategoryButton'
import CountryOfOriginModal from '@/components/CountryOfOriginModal'
import ErrorModal from '@/components/ErrorModal'
import MenuCard from '@/components/MenuCard'
import MenuModal from '@/components/MenuModal'
import OrderHistoryModal from '@/components/OrderHistoryModal'
import StaffCallModal from '@/components/StaffCallModal'
import SuccessModal from '@/components/SuccessModal'
import { colors, defaultCategory, fonts, images, milliTimes } from '@/constants'
import {
  useCreateTableOrder,
  useGetDevice,
  useGetMenus,
  useGetStore,
  useGetTableOrderHistories,
  useModal,
  useStaffCall,
} from '@/hooks'
import { useCreateCardPayment } from '@/hooks/usePayment'
import KscatModule, { KscatResponse } from '@/modules/kscat'
import { Category, Menu, OrderCreate } from '@/types'
import { calculateService, calculateVat, parseErrorMessage } from '@/utils'

const CustomerTableScreen = () => {
  // Common
  const { width: screenWidth } = useWindowDimensions()
  const { device } = useGetDevice()
  const [idleTime, setIdleTime] = useState(milliTimes.FIVE_MINUTE)
  const [error, setError] = useState({ title: '', message: '' })

  // Store
  const { data: store } = useGetStore(device?.storeId)

  // Menu
  const { categories } = useGetMenus(device?.storeId)
  const menusRef = useRef<FlatList | null>(null)
  const categoriesRef = useRef<FlatList | null>(null)
  const [categoryContentWidth, setCategoryContentWidth] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  // Order
  const { histories } = useGetTableOrderHistories(device?.tableNo)
  const [cart, setCart] = useState<OrderCreate[]>([])
  const [selectedStaffCallOption, setSelectedStaffCallOption] = useState('')
  const staffCall = useStaffCall()
  const createTableOrder = useCreateTableOrder()
  const createCardPayment = useCreateCardPayment()

  // Modal
  const countryOfOriginModal = useModal()
  const menuModal = useModal()
  const staffCallModal = useModal()
  const staffCallSuccessModal = useModal()
  const cartModal = useModal()
  const orderHistoryModal = useModal()
  const orderSuccessModal = useModal()
  const errorModal = useModal()

  const resetAll = useCallback(() => {
    setIdleTime(milliTimes.FIVE_MINUTE)
    setError({ title: '', message: '' })
    setSelectedCategory(defaultCategory)
    setSelectedStaffCallOption('')
    setCart([])
    countryOfOriginModal.close()
    menuModal.close()
    staffCallModal.close()
    staffCallSuccessModal.close()
    cartModal.close()
    orderHistoryModal.close()
    orderSuccessModal.close()
    errorModal.close()
    categoriesRef.current?.scrollToIndex({ index: 0 })
    menusRef.current?.scrollToIndex({ index: 0 })
  }, [
    countryOfOriginModal,
    menuModal,
    staffCallModal,
    staffCallSuccessModal,
    cartModal,
    orderHistoryModal,
    orderSuccessModal,
    errorModal,
  ])

  useEffect(() => {
    setCategoryContentWidth(screenWidth - 210)
  }, [screenWidth])

  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategory(categories[0])
    }
  }, [categories])

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
    if (idleTime < milliTimes.FIVE_MINUTE) {
      runOnJS(setIdleTime)(milliTimes.FIVE_MINUTE)
    }
  })

  const handleOpenMenuModalOrAddToCart = (menu: Menu) => {
    if (store?.setting.showMenuPopup || menu.menuOptionGroups.length > 0) {
      setSelectedMenu(menu)
      menuModal.open()
    } else {
      const copy = [...cart]
      const index = copy.findIndex(item => item.menuId === menu.menuId)
      if (index === -1) {
        copy.push({ menuId: menu.menuId, quantity: 1, menuOptionGroups: [] })
      } else {
        copy[index].quantity += 1
      }
      setCart(copy)
    }
  }

  const calculateCartTotalPrice = () => {
    let totalPrice = 0
    for (const orderCreate of cart) {
      const menu = categories?.[0].menus.find(
        menu => menu.menuId === orderCreate.menuId,
      )
      if (!menu) {
        setCart([])
        throw new Error('변경된 메뉴 항목이 있습니다. 다시 시도해 주세요.')
      }

      let optionPrice = 0
      const menuOptions = menu.menuOptionGroups.flatMap(
        group => group.menuOptions,
      )
      orderCreate.menuOptionGroups
        .flatMap(group => group.orderOptions)
        .forEach(option => {
          const menuOption = menuOptions.find(
            menuOption =>
              menuOption.name === option.name &&
              menuOption.price === option.price,
          )
          if (!menuOption) {
            setCart([])
            throw new Error('변경된 메뉴 항목이 있습니다. 다시 시도해 주세요.')
          }
          optionPrice += menuOption.price
        })
      totalPrice += (menu.price + optionPrice) * orderCreate.quantity
    }
    return totalPrice
  }

  const callStaff = () => {
    if (selectedStaffCallOption) {
      staffCallModal.close()
      staffCall.mutate(
        { optionName: selectedStaffCallOption },
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

  const submitCreateOrder = async () => {
    if (cart.length <= 0) {
      return
    }
    if (!store?.setting || store.setting.ksnetDeviceNo.length < 8) {
      setError({
        title: '단말기 번호가 등록되지 않았습니다.',
        message: '설정 페이지에서 Ksnet 단말기 번호를 등록해주세요.',
      })
      errorModal.open()
      return
    }
    if (device?.paymentType === 'PREPAID') {
      try {
        const amount = calculateCartTotalPrice()
        const installment = '00'
        const response = await KscatModule.approveIC(
          store.setting.ksnetDeviceNo,
          installment,
          amount,
        )
        createPayment(amount, installment, response)
      } catch (exception: any) {
        if (exception.code === 'FAIL') {
          setError({ title: '결제 실패', message: exception.message })
          errorModal.open()
        } else {
          setError({ title: '결제 오류', message: exception.message })
          errorModal.open()
        }
      }
    } else {
      createOrder()
    }
  }

  const createPayment = (
    amount: number,
    installment: string,
    response: KscatResponse,
  ) => {
    const service = calculateService(amount, 0)
    const vat = calculateVat(amount, service, 10)
    createCardPayment.mutate(
      {
        tableNo: device?.tableNo ?? 0,
        amount: amount,
        approvalNo: response.approvalNo,
        installment: installment,
        cardNo: response.filler,
        issuerName: response.message1,
        purchaseName: response.purchaseCompanyName,
        merchantNo: response.merchantNo,
        tradeTime: response.transferDate,
        tradeUniqueNo: response.transactionUniqueNo,
        vat: vat,
        supplyAmount: amount - service - vat,
      },
      {
        onSuccess: () => {
          createOrder()
        },
        onError: error => {
          setError({
            title: '오류: 직원을 호출하여 결제를 취소하세요.',
            message: parseErrorMessage(error),
          })
          errorModal.open()
        },
      },
    )
  }

  const createOrder = () => {
    if (!device) {
      return
    }

    createTableOrder.mutate(
      { tableNo: device.tableNo, memo: '', orderMenus: cart },
      {
        onSuccess: () => {
          cartModal.close()
          orderSuccessModal.open()
        },
        onError: error => {
          setError({
            title: '주문 실패',
            message: parseErrorMessage(error),
          })
          errorModal.open()
        },
      },
    )
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
                  keyExtractor={(item, index) => `${item.categoryId}-${index}`}
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
            {categories && categories.length > 0 && (
              <FlatList
                ref={menusRef}
                data={categories[0].menus}
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
                    selectedCategory={selectedCategory}
                    rootNumColumns={4}
                    rootGap={16}
                    rootPaddingHorizontal={24}
                    onPress={() =>
                      handleOpenMenuModalOrAddToCart(renderItem.item)
                    }
                  />
                )}
              />
            )}
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerLeft}>
            <Pressable
              style={styles.receipt}
              onPress={() => {
                if (histories.length > 0) {
                  orderHistoryModal.open()
                }
              }}
            >
              <ReceiptIcon />
              <Text style={styles.receiptText}>주문 내역</Text>
            </Pressable>
          </View>
          <View style={styles.footerRight}>
            <Pressable style={styles.staffCall} onPress={staffCallModal.open}>
              <BellIcon />
              <Text style={styles.staffCallText}>직원 호출</Text>
            </Pressable>
            <Pressable
              style={styles.cart}
              onPress={() => {
                if (cart.length > 0) {
                  cartModal.open()
                }
              }}
            >
              <Text style={styles.cartText}>장바구니</Text>
              <Text style={styles.cartCountText}>{cart.length}</Text>
            </Pressable>
          </View>
        </View>
        <CountryOfOriginModal
          isVisible={countryOfOriginModal.isOpen}
          countryOfOrigins={store?.setting.countryOfOrigins ?? []}
          close={countryOfOriginModal.close}
        />
        <MenuModal
          visible={menuModal.isOpen}
          selectedMenu={selectedMenu}
          cart={cart}
          setCart={setCart}
          close={() => {
            setSelectedMenu(null)
            menuModal.close()
          }}
        />
        <StaffCallModal
          isVisible={staffCallModal.isOpen}
          options={store?.setting.staffCallOptions ?? []}
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
        <CartModal
          visible={cartModal.isOpen}
          menus={categories?.[0]?.menus ?? []}
          cart={cart}
          setCart={setCart}
          paymentType={device?.paymentType ?? 'POSTPAID'}
          submit={submitCreateOrder}
          close={cartModal.close}
        />
        <OrderHistoryModal
          isVisible={orderHistoryModal.isOpen}
          histories={histories}
          setting={store?.setting}
          close={orderHistoryModal.close}
        />
        <SuccessModal
          isVisible={orderSuccessModal.isOpen}
          title="주문 완료"
          image={images.COMPLETE_ANIMATION}
          message="주문이 완료되었습니다."
          close={resetAll}
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
