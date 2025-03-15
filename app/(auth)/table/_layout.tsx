import { useCallback } from 'react'

import { Redirect, Stack, useFocusEffect } from 'expo-router'
import { OrientationLock } from 'expo-screen-orientation'

import { DevicePurpose } from '@/constants'
import { useGetDevice, useOrientation } from '@/hooks'
import { getNavigatePath } from '@/utils'

const CustomerTableLayout = () => {
  const { device } = useGetDevice()
  const { lockOrientation, unlockOrientation } = useOrientation()

  useFocusEffect(
    useCallback(() => {
      void lockOrientation(OrientationLock.LANDSCAPE_RIGHT)
      return () => unlockOrientation()
    }, [lockOrientation, unlockOrientation]),
  )

  if (!device) {
    return null
  }

  if (device.purpose !== DevicePurpose.TABLE) {
    return <Redirect href={`${getNavigatePath(device.purpose)}`} />
  }

  return (
    <Stack>
      <Stack.Screen name="customer" options={{ headerShown: false }} />
    </Stack>
  )
}

export default CustomerTableLayout
