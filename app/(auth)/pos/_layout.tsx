import { Redirect, Stack } from 'expo-router'

import { colors } from '@/constants'
import { useGetDevice } from '@/hooks'
import { getNavigatePath } from '@/utils'

const PosLayout = () => {
  const { device } = useGetDevice()

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
