import { useEffect, useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'

import { router } from 'expo-router'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputLabel from '@/components/InputLabel'
import Picker from '@/components/Picker'
import { AuthenticationPurpose, fonts, milliTimes } from '@/constants'
import { useSendAuthCode, useVerifyAuthCode } from '@/hooks'
import {
  clearNullableInterval,
  formatTime,
  validateAuthCode,
  validatePhoneNumber,
} from '@/utils'

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

interface RegistrationForm {
  code: RegistrationFormProps
  phoneNumber: RegistrationFormProps
}

interface RegistrationFormProps {
  value: string
  error: string
}

const RegistrationStep1Screen = () => {
  const phoneNumberRef = useRef<TextInput | null>(null)
  const authenticationCodeRef = useRef<TextInput | null>(null)

  const [isAuthenticate, setIsAuthenticate] = useState(false)
  const [isSendAuthCode, setIsSendAuthCode] = useState(false)
  const [authTime, setAuthTime] = useState(milliTimes.FIVE_MINUTE)
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    code: { value: '', error: '' },
    phoneNumber: { value: '', error: '' },
  })

  const sendAuthCode = useSendAuthCode()
  const verifyAuthCode = useVerifyAuthCode()

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isSendAuthCode && authTime > 0) {
      interval = setInterval(() => {
        setAuthTime(prev => prev - milliTimes.ONE_SECOND)
      }, milliTimes.ONE_SECOND)
    } else if (authTime <= 0) {
      clearNullableInterval(interval)
    }

    return () => clearNullableInterval(interval)
  }, [isSendAuthCode, authTime])

  const handleOnChange = (key: keyof RegistrationForm, value: string) => {
    setRegistrationForm(prev => ({
      ...prev,
      [key]: { value, error: '' },
    }))
  }

  const handleOnError = (key: keyof RegistrationForm, error: string) => {
    setRegistrationForm(prev => ({
      ...prev,
      [key]: { value: prev[key].value, error },
    }))
  }

  const sendAuthenticationCode = () => {
    const phoneNumber = registrationForm.phoneNumber.value
    const error = validatePhoneNumber(phoneNumber)

    if (error) {
      handleOnError('phoneNumber', error)
      return
    }

    sendAuthCode.mutate(
      {
        phoneNumber: phoneNumber,
        purpose: AuthenticationPurpose.DEVICE_REGISTRATION,
      },
      {
        onSuccess: () => {
          setAuthTime(milliTimes.FIVE_MINUTE)
          setIsSendAuthCode(true)
          authenticationCodeRef.current?.focus()
        },
        onError: error => {
          handleOnError(
            'phoneNumber',
            error.response?.data.message ?? error.message,
          )
          phoneNumberRef.current?.focus()
        },
      },
    )
  }

  const verifyAuthenticationCode = () => {
    const code = registrationForm.code.value
    const error = validateAuthCode(code)

    if (error) {
      handleOnError('code', error)
      return
    }

    verifyAuthCode.mutate(
      {
        code: registrationForm.code.value,
        phoneNumber: registrationForm.phoneNumber.value,
        purpose: AuthenticationPurpose.DEVICE_REGISTRATION,
      },
      {
        onSuccess: () => {
          setAuthTime(milliTimes.ZERO)
          setIsAuthenticate(true)
        },
        onError: error => {
          handleOnError('code', error.response?.data.message ?? error.message)
          authenticationCodeRef.current?.focus()
        },
      },
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>기기 등록</Text>
        </View>
        <View style={styles.sectionContainer}>
          <View>
            <InputLabel label="휴대폰 번호" />
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.inputContainer}>
                <Input
                  ref={phoneNumberRef}
                  inputMode="numeric"
                  placeholder="사장님 계정에 등록된 전화번호를 입력해주세요."
                  value={registrationForm.phoneNumber.value}
                  error={registrationForm.phoneNumber.error}
                  onChangeText={value => handleOnChange('phoneNumber', value)}
                  returnKeyType="done"
                  disabled={isAuthenticate}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  label={isSendAuthCode ? '재요청' : '인증요청'}
                  size="medium"
                  onPress={sendAuthenticationCode}
                  disabled={isAuthenticate}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={styles.inputWithButtonContainer}>
              <View style={styles.inputContainer}>
                <Input
                  ref={authenticationCodeRef}
                  inputMode="numeric"
                  placeholder="인증번호를 입력해주세요."
                  right={isSendAuthCode ? `${formatTime(authTime)}` : ''}
                  value={registrationForm.code.value}
                  error={registrationForm.code.error}
                  onChangeText={value => handleOnChange('code', value)}
                  disabled={isAuthenticate}
                  returnKeyType="done"
                  autoComplete="one-time-code"
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  label="확인"
                  size="medium"
                  onPress={verifyAuthenticationCode}
                  disabled={!isSendAuthCode || isAuthenticate}
                />
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
  contentContainer: {
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
