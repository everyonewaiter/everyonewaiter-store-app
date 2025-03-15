import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { runOnJS } from 'react-native-reanimated'

import { useFocusEffect } from 'expo-router'
import { OrientationLock } from 'expo-screen-orientation'

import { AdultIcon, BabyIcon } from '@/assets/icons'
import Button from '@/components/Button'
import LogoHeaderTitle from '@/components/LogoHeaderTitle'
import { Modal } from '@/components/Modal'
import NumPad from '@/components/NumPad'
import PersonCountBox from '@/components/PersonCountBox'
import { colors, fonts, milliTimes } from '@/constants'
import { useCreateWaiting, useGetWaitingCount, useOrientation } from '@/hooks'
import {
  clearNullableInterval,
  formatPhoneNumber,
  parseErrorMessage,
} from '@/utils'

const PHONE_NUMBER_PREFIX = '010'

const WaitingRegistrationScreen = () => {
  const { lockOrientation } = useOrientation()

  const [idleTime, setIdleTime] = useState(milliTimes.ONE_MINUTE)
  const [personCount, setPersonCount] = useState({
    adult: 0,
    infant: 0,
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidForm, setIsValidForm] = useState(false)
  const [isVisibleSubmitModal, setIsVisibleSubmitModal] = useState(false)
  const [isVisibleSuccessModal, setIsVisibleSuccessModal] = useState(false)
  const [isVisibleErrorModal, setIsVisibleErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { waitingCount } = useGetWaitingCount()
  const createWaiting = useCreateWaiting()

  useFocusEffect(
    useCallback(() => {
      void lockOrientation(OrientationLock.LANDSCAPE_RIGHT)
    }, [lockOrientation]),
  )

  useEffect(() => {
    if (personCount.adult > 0 && phoneNumber.length === 8) {
      setIsValidForm(true)
    }
  }, [personCount.adult, phoneNumber])

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        personCount.adult !== 0 ||
        personCount.infant !== 0 ||
        phoneNumber !== ''
      ) {
        setIdleTime(prev => prev - milliTimes.ONE_SECOND)
      }
    }, milliTimes.ONE_SECOND)

    return () => clearNullableInterval(interval)
  }, [personCount, phoneNumber])

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

  const minusPersonCount = (key: 'adult' | 'infant') => {
    if (personCount[key] > 0) {
      setPersonCount(prev => ({ ...prev, [key]: prev[key] - 1 }))
    }
  }

  const plusPersonCount = (key: 'adult' | 'infant') => {
    if (personCount[key] <= 30) {
      setPersonCount(prev => ({ ...prev, [key]: prev[key] + 1 }))
    }
  }

  const addPhoneNumber = (num: number) => {
    if (phoneNumber.length < 8) {
      setPhoneNumber(prev => prev + num)
    }
  }

  const removeLastPhoneNumber = () => {
    setPhoneNumber(prev => prev.slice(0, -1))
  }

  const resetAll = () => {
    setIdleTime(milliTimes.ONE_MINUTE)
    setPersonCount({ adult: 0, infant: 0 })
    setPhoneNumber('')
    setIsLoading(false)
    setIsValidForm(false)
    setIsVisibleSubmitModal(false)
    setIsVisibleSuccessModal(false)
    setIsVisibleErrorModal(false)
    setErrorMessage('')
  }

  const submitCreateWaiting = () => {
    setIsLoading(true)
    createWaiting.mutate(
      {
        phoneNumber: `${PHONE_NUMBER_PREFIX}${phoneNumber}`,
        adult: personCount.adult,
        infant: personCount.infant,
      },
      {
        onSuccess: () => {
          setIsVisibleSubmitModal(false)
          setIsVisibleSuccessModal(true)
        },
        onError: error => {
          setIsVisibleSubmitModal(false)
          setErrorMessage(parseErrorMessage(error))
          setIsVisibleErrorModal(true)
        },
        onSettled: () => {
          setIsLoading(false)
        },
      },
    )
  }

  return (
    <GestureDetector gesture={resetIdleTime}>
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoTextContainer}>
              <LogoHeaderTitle />
              <View>
                <Text style={styles.mainText}>현재 대기 중인 팀은</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.mainText, styles.highlightMainText]}>
                    {waitingCount}팀
                  </Text>
                  <Text style={styles.mainText}> 입니다.</Text>
                </View>
              </View>
              <View>
                {waitingCount > 0 ? (
                  <Text style={styles.subText}>
                    자리가 준비되면 연락드릴게요!{'\n'}
                    인원과 전화번호를 입력해 주세요.
                  </Text>
                ) : (
                  <Text style={styles.subText}>
                    현재 대기 중인 팀이 없습니다.{'\n'}
                    지금 바로 매장에 입장해 주세요!
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.personContainer}>
              <View style={styles.personCountContainer}>
                <PersonCountBox
                  icon={<AdultIcon />}
                  label="성인"
                  count={personCount.adult}
                  minusHandler={() => minusPersonCount('adult')}
                  plusHandler={() => plusPersonCount('adult')}
                />
                <PersonCountBox
                  icon={<BabyIcon />}
                  label="유아"
                  count={personCount.infant}
                  minusHandler={() => minusPersonCount('infant')}
                  plusHandler={() => plusPersonCount('infant')}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.numPadContainer}>
          <View style={styles.numPadContent}>
            <View style={styles.phoneNumberContainer}>
              <Text style={styles.phoneNumberText}>
                {`${PHONE_NUMBER_PREFIX} - ${formatPhoneNumber(phoneNumber)}`}
              </Text>
              <Text style={styles.phoneNumberSubText}>
                실시간 웨이팅 안내를 받을 수 있는 번호를 입력해 주세요.
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <View style={styles.numPad}>
                <NumPad
                  label={1}
                  positionX="left"
                  positionY="top"
                  onPress={() => addPhoneNumber(1)}
                />
                <NumPad
                  label={2}
                  positionX="center"
                  positionY="top"
                  onPress={() => addPhoneNumber(2)}
                />
                <NumPad
                  label={3}
                  positionX="right"
                  positionY="top"
                  onPress={() => addPhoneNumber(3)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad
                  label={4}
                  positionX="left"
                  positionY="center"
                  onPress={() => addPhoneNumber(4)}
                />
                <NumPad
                  label={5}
                  positionX="center"
                  positionY="center"
                  onPress={() => addPhoneNumber(5)}
                />
                <NumPad
                  label={6}
                  positionX="right"
                  positionY="center"
                  onPress={() => addPhoneNumber(6)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad
                  label={7}
                  positionX="left"
                  positionY="center"
                  onPress={() => addPhoneNumber(7)}
                />
                <NumPad
                  label={8}
                  positionX="center"
                  positionY="center"
                  onPress={() => addPhoneNumber(8)}
                />
                <NumPad
                  label={9}
                  positionX="right"
                  positionY="center"
                  onPress={() => addPhoneNumber(9)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad
                  label="reset"
                  positionX="left"
                  positionY="bottom"
                  onPress={resetAll}
                />
                <NumPad
                  label={0}
                  positionX="center"
                  positionY="bottom"
                  onPress={() => addPhoneNumber(0)}
                />
                <NumPad
                  label="back"
                  positionX="right"
                  positionY="bottom"
                  onPress={removeLastPhoneNumber}
                />
              </View>
            </View>
            <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
              <Button
                label="등록하기"
                color="black"
                onPress={() => setIsVisibleSubmitModal(true)}
                disabled={!isValidForm}
              />
            </View>
          </View>
        </View>
        <Modal visible={isVisibleSubmitModal}>
          <Modal.Container>
            <Modal.Title color="red">{`${PHONE_NUMBER_PREFIX} - ${formatPhoneNumber(phoneNumber)}`}</Modal.Title>
            <Modal.Content>위 번호로 웨이팅 등록을 하시겠습니까?</Modal.Content>
            <Modal.ButtonContainer>
              <Modal.Button label="닫기" color="gray" onPress={resetAll} />
              <Modal.Button
                label="등록하기"
                color="black"
                onPress={submitCreateWaiting}
                disabled={isLoading}
              />
            </Modal.ButtonContainer>
          </Modal.Container>
        </Modal>
        <Modal visible={isVisibleSuccessModal}>
          <Modal.Container>
            <Modal.Title color="black">웨이팅 등록 완료</Modal.Title>
            <Modal.Content>
              휴대폰 번호로 전송된 알림톡 또는 문자 메시지를 확인해 주세요.
            </Modal.Content>
            <Modal.ButtonContainer>
              <Modal.Button label="확인" onPress={resetAll} />
            </Modal.ButtonContainer>
          </Modal.Container>
        </Modal>
        <Modal visible={isVisibleErrorModal}>
          <Modal.Container>
            <Modal.Title color="red">웨이팅 등록 실패</Modal.Title>
            <Modal.Content>{errorMessage}</Modal.Content>
            <Modal.ButtonContainer>
              <Modal.Button label="확인" onPress={resetAll} />
            </Modal.ButtonContainer>
          </Modal.Container>
        </Modal>
      </SafeAreaView>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 32,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  viewContainer: {
    flex: 1,
  },
  numPadContainer: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  infoTextContainer: {
    gap: 32,
  },
  mainText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 60,
  },
  highlightMainText: {
    color: colors.PRIMARY_RED,
    borderBottomWidth: 3,
    borderBottomColor: colors.PRIMARY_RED,
  },
  subText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    color: colors.GRAY2_55,
    fontSize: 24,
  },
  personContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  personCountContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    padding: 32,
  },
  numPadContent: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  phoneNumberContainer: {
    flex: 0.5,
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  phoneNumberText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 40,
  },
  phoneNumberSubText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 24,
    color: colors.GRAY3_99,
  },
  numPad: {
    height: '25%',
    flexDirection: 'row',
  },
})

export default WaitingRegistrationScreen
