import { Redirect, Stack } from 'expo-router'

const UnAuthenticationLayout = () => {
  const isAuthenticated = false

  if (isAuthenticated) {
    return <Redirect href="/" />
  }

  return <Stack />
}

export default UnAuthenticationLayout
