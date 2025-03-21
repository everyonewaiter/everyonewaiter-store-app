import { useCallback } from 'react'

import { Redirect, Stack, useFocusEffect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'

import LogoHeaderTitle from '@/components/LogoHeaderTitle'
import { colors } from '@/constants'
import { useAuthentication } from '@/contexts/AuthenticationContext'

const UnAuthenticationLayout = () => {
  const { isAuthenticated } = useAuthentication()

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        void SplashScreen.hideAsync()
      }
    }, [isAuthenticated]),
  )

  if (isAuthenticated) {
    return <Redirect href="/" />
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.BLACK,
        contentStyle: { backgroundColor: colors.WHITE },
      }}
    >
      <Stack.Screen
        name="registration-step1"
        options={{
          title: '',
          headerTitle: () => <LogoHeaderTitle paddingLeft={24} />,
        }}
      />
      <Stack.Screen
        name="registration-step2"
        options={{
          title: '',
          headerTitle: () => <LogoHeaderTitle paddingLeft={12} />,
        }}
      />
    </Stack>
  )
}

export default UnAuthenticationLayout
