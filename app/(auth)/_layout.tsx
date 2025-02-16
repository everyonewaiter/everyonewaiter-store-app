import { Redirect, Stack } from 'expo-router'

const AuthenticationLayout = () => {
  const isAuthenticated = false

  if (!isAuthenticated) {
    return <Redirect href="/device/registration-step1" />
  }

  return <Stack />
}

export default AuthenticationLayout
