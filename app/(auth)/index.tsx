import { Redirect } from 'expo-router'

import { useAuthentication } from '@/contexts/AuthenticationContext'
import { getNavigatePath } from '@/utils'

const AuthenticationNavigator = () => {
  const { device } = useAuthentication()

  if (!device) {
    return null
  }

  return <Redirect href={`${getNavigatePath(device.purpose)}`} />
}

export default AuthenticationNavigator
