import { Redirect } from 'expo-router'

import { useGetDevice } from '@/hooks'
import { getNavigatePath } from '@/utils'

const AuthenticationNavigator = () => {
  const { device } = useGetDevice()

  if (!device) {
    return null
  }

  return <Redirect href={`${getNavigatePath(device.purpose)}`} />
}

export default AuthenticationNavigator
