import { Redirect, Stack } from 'expo-router'

import { useAuthentication } from '@/contexts/AuthenticationContext'
import SseProvider from '@/contexts/SseContext'

const AuthenticationLayout = () => {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) {
    return <Redirect href="/device/registration-step1" />
  }

  return (
    <SseProvider>
      <Stack>
        <Stack.Screen name="waiting" options={{ headerShown: false }} />
      </Stack>
    </SseProvider>
  )
}

export default AuthenticationLayout
