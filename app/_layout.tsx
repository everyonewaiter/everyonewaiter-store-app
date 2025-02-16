import { useEffect } from 'react'
import { Alert } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { useFonts } from 'expo-font'
import { useKeepAwake } from 'expo-keep-awake'
import { SplashScreen, Stack } from 'expo-router'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/api'
import { fontAssets } from '@/constants'
import AuthenticationProvider, {
  useAuthentication,
} from '@/contexts/AuthenticationContext'
import { useDeviceType } from '@/hooks'

void SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  useKeepAwake()
  const { isMobile } = useDeviceType()

  if (isMobile) {
    Alert.alert(
      '알림',
      '모바일 환경은 지원하지 않습니다.\n태블릿을 이용해 주세요.',
      [{ text: '확인' }],
    )
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <EveryoneWaiterApplication />
      </AuthenticationProvider>
    </QueryClientProvider>
  )
}

const EveryoneWaiterApplication = () => {
  const [loaded] = useFonts(fontAssets)
  const { isLoading } = useAuthentication()

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isLoading])

  if (!loaded || isLoading) {
    return null
  }

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="device" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  )
}

export default RootLayout
