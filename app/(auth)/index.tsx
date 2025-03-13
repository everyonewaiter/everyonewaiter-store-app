import { useEffect } from 'react'

import { router } from 'expo-router'

import { DevicePurpose } from '@/constants'
import { useGetDevice } from '@/hooks'
import { Device } from '@/types'

const navigate = async (device: Device | undefined) => {
  switch (device?.purpose) {
    case DevicePurpose.WAITING:
      router.replace('/waiting/registration')
      break
    default:
      throw new Error('Unknown device')
  }
}

const AuthenticationNavigator = () => {
  const { device } = useGetDevice()

  useEffect(() => {
    void navigate(device)
  }, [device])

  return null
}

export default AuthenticationNavigator
