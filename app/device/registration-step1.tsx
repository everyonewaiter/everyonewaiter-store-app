import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { router } from 'expo-router'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputLabel from '@/components/InputLabel'
import Picker from '@/components/Picker'
import { fonts } from '@/constants'
import { useDeviceType } from '@/hooks'

const mockStoreList = [
  {
    label: '나루 1호점',
    value: '1',
  },
  {
    label: '나루 2호점',
    value: '2',
  },
]

const RegistrationStep1Screen = () => {
  const { isTablet } = useDeviceType()

  return (
    <SafeAreaView style={styles.container}>
      <View style={isTablet ? styles.tablet : styles.mobile}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>기기 등록</Text>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <InputLabel label="휴대폰 번호" />
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.inputContainer}>
                <Input
                  inputMode="numeric"
                  placeholder="사장님 계정에 등록된 전화번호를 입력해주세요."
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button label="인증요청" size="medium" />
              </View>
            </View>
          </View>
          <View>
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.inputContainer}>
                <Input
                  inputMode="numeric"
                  placeholder="인증번호를 입력해주세요."
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button label="확인" size="medium" />
              </View>
            </View>
          </View>
          <View>
            <InputLabel label="매장 선택" />
            <Picker items={mockStoreList} />
          </View>
        </View>
        <Button
          label="다음"
          onPress={() => router.push('/device/registration-step2')}
        />
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
    marginBottom: 48,
  },
  headerText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 24,
    fontWeight: '600',
  },
  sectionContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWithButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: 90,
    height: 40,
  },
})

export default RegistrationStep1Screen
