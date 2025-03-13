import { useCallback } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { useFocusEffect } from 'expo-router'
import { OrientationLock } from 'expo-screen-orientation'

import { AdultIcon, BabyIcon } from '@/assets/icons'
import Button from '@/components/Button'
import LogoHeaderTitle from '@/components/LogoHeaderTitle'
import NumPad from '@/components/NumPad'
import PersonCountBox from '@/components/PersonCountBox'
import { colors, fonts } from '@/constants'
import { useOrientation } from '@/hooks'

const waitingCount = 0

const WaitingRegistrationScreen = () => {
  const { lockOrientation } = useOrientation()

  useFocusEffect(
    useCallback(() => {
      void lockOrientation(OrientationLock.LANDSCAPE_RIGHT)
    }, [lockOrientation]),
  )

  return (
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
                count={0}
                minusHandler={() => {}}
                plusHandler={() => {}}
              />
              <PersonCountBox
                icon={<BabyIcon />}
                label="유아"
                count={0}
                minusHandler={() => {}}
                plusHandler={() => {}}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.numPadContainer}>
        <View style={styles.numPadContent}>
          <View style={styles.phoneNumberContainer}>
            <Text style={styles.phoneNumberText}>010 -</Text>
            <Text style={styles.phoneNumberSubText}>
              실시간 웨이팅 안내를 받을 수 있는 번호를 입력해 주세요.
            </Text>
          </View>
          <View style={{ flex: 3 }}>
            <View style={styles.numPad}>
              <NumPad label={1} positionX="left" positionY="top" />
              <NumPad label={2} positionX="center" positionY="top" />
              <NumPad label={3} positionX="right" positionY="top" />
            </View>
            <View style={styles.numPad}>
              <NumPad label={4} positionX="left" positionY="center" />
              <NumPad label={5} positionX="center" positionY="center" />
              <NumPad label={6} positionX="right" positionY="center" />
            </View>
            <View style={styles.numPad}>
              <NumPad label={7} positionX="left" positionY="center" />
              <NumPad label={8} positionX="center" positionY="center" />
              <NumPad label={9} positionX="right" positionY="center" />
            </View>
            <View style={styles.numPad}>
              <NumPad label="reset" positionX="left" positionY="bottom" />
              <NumPad label={0} positionX="center" positionY="bottom" />
              <NumPad label="back" positionX="right" positionY="bottom" />
            </View>
          </View>
          <View style={{ flex: 0.5, justifyContent: 'flex-end' }}>
            <Button label="등록하기" color="black" />
          </View>
        </View>
      </View>
    </SafeAreaView>
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
