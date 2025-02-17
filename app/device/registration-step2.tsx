import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { useLocalSearchParams } from 'expo-router'

import Button from '@/components/Button'
import Input from '@/components/Input'
import RadioBox from '@/components/RadioBox'
import { fonts } from '@/constants'
import { useDeviceType } from '@/hooks'

const mockRadioItems = [
  { label: '손님 테이블', value: '1' },
  { label: '웨이팅 등록', value: '2' },
  { label: '홀 관리', value: '3' },
  { label: 'POS', value: '4' },
]

type RegistrationPageParams = {
  userId: string
  storeId: string
}

const RegistrationStep2Screen = () => {
  const { isTablet } = useDeviceType()
  const { userId, storeId } = useLocalSearchParams<RegistrationPageParams>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={isTablet ? styles.tablet : styles.mobile}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>기기 등록</Text>
          <Text>아래 버튼을 눌러 해당 기기의 용도를 선택하세요!</Text>
          <Text>{`사용자 ID: ${userId}`}</Text>
          <Text>{`매장 ID: ${storeId}`}</Text>
        </View>
        <View style={styles.selectBoxContainer}>
          <RadioBox items={mockRadioItems} />
        </View>
        <View style={styles.inputContainer}>
          <Input
            label="기기 이름"
            placeholder="기기 이름을 입력해주세요."
            defaultValue="1번 테이블"
          />
        </View>
        <Button label="기기 등록" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobile: {
    width: 320,
  },
  tablet: {
    width: 480,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 24,
    fontWeight: '600',
  },
  headerDescription: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
    fontWeight: '400',
  },
  selectBoxContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
})

export default RegistrationStep2Screen
