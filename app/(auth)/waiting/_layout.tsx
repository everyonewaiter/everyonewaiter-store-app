import { useCallback } from 'react'

import { Redirect, Stack, useFocusEffect } from 'expo-router'
import { OrientationLock } from 'expo-screen-orientation'
import * as SplashScreen from 'expo-splash-screen'

import { colors, DevicePurpose } from '@/constants'
import { useGetDevice, useOrientation } from '@/hooks'
import { getNavigatePath } from '@/utils'

const WaitingLayout = () => {
  const { device } = useGetDevice()
  const { lockOrientation, unlockOrientation } = useOrientation()

  useFocusEffect(
    useCallback(() => {
      void SplashScreen.hideAsync()
      void lockOrientation(OrientationLock.LANDSCAPE_RIGHT)
      return () => unlockOrientation()
    }, [lockOrientation, unlockOrientation]),
  )

  if (!device) {
    return null
  }

  if (device.purpose !== DevicePurpose.WAITING) {
    return <Redirect href={`${getNavigatePath(device.purpose)}`} />
  }

  return (
    <Stack
      screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}
    >
      <Stack.Screen name="registration" options={{ headerShown: false }} />
    </Stack>
  )
}

export default WaitingLayout
