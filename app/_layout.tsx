import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

import { useFonts } from 'expo-font'
import { useKeepAwake } from 'expo-keep-awake'
import { SplashScreen, Stack } from 'expo-router'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/api'
import { fontAssets } from '@/constants'

void SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  useKeepAwake()
  return (
    <QueryClientProvider client={queryClient}>
      <EveryoneWaiterApplication />
    </QueryClientProvider>
  )
}

const EveryoneWaiterApplication = () => {
  const [loaded] = useFonts(fontAssets)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
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
