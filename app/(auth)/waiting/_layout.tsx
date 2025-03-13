import { Stack } from 'expo-router'

import { colors } from '@/constants'

const WaitingLayout = () => {
  return (
    <Stack
      screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}
    >
      <Stack.Screen name="registration" options={{ headerShown: false }} />
    </Stack>
  )
}

export default WaitingLayout
