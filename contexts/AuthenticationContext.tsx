import { createContext, PropsWithChildren, useContext } from 'react'

import { useGetDevice } from '@/hooks'

interface AuthenticationContextProps {
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  isAuthenticated: false,
  isLoading: false,
})

export const useAuthentication = () => {
  return useContext(AuthenticationContext)
}

const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const { isSuccess, isPending } = useGetDevice()

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: isSuccess,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthenticationProvider
