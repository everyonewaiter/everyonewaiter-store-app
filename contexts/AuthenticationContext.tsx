import { createContext, PropsWithChildren, useContext } from 'react'

import { useGetDevice } from '@/hooks'
import { Device } from '@/types'

interface AuthenticationContextProps {
  device: Device | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  device: null,
  isAuthenticated: false,
  isLoading: false,
})

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}

const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const { device, isSuccess, isPending } = useGetDevice()

  return (
    <AuthenticationContext.Provider
      value={{
        device: device ?? null,
        isAuthenticated: isSuccess,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationProvider
