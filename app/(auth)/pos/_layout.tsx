import { Redirect, Stack } from 'expo-router'

import { colors } from '@/constants'
import { useAuthentication } from '@/contexts/AuthenticationContext'
import { getNavigatePath } from '@/utils'

const PosLayout = () => {
  const { device } = useAuthentication()

  if (!device) {
    return null
  }

  if (device.purpose !== 'POS') {
    return <Redirect href={`${getNavigatePath(device.purpose)}`} />
  }

  return (
    <Stack
      screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}
    >
      <Stack.Screen name="tables" options={{ headerShown: false }} />
    </Stack>
  )
}

export default PosLayout
