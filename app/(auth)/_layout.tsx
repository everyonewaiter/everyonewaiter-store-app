import { Redirect, Stack } from 'expo-router'

import { useAuthentication } from '@/contexts/AuthenticationContext'

const AuthenticationLayout = () => {
  const { isAuthenticated } = useAuthentication()

  if (!isAuthenticated) {
    return <Redirect href="/device/registration-step1" />
  }

  return <Stack />
}

export default AuthenticationLayout
