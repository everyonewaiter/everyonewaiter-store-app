import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as Application from 'expo-application'

import { useGetApkVersion } from '@/hooks/useGetApkVersion'
import { updateApp } from '@/utils'

interface AuthenticationContextProps {
  isUpdated: boolean
}

const AppUpdateContext = createContext<AuthenticationContextProps>({
  isUpdated: false,
})

export const useAppUpdate = () => {
  return useContext(AppUpdateContext)
}

const AppUpdateProvider = ({ children }: PropsWithChildren) => {
  const [isUpdated, setIsUpdated] = useState(false)
  const { apkVersion, isSuccess, isPending } = useGetApkVersion()

  useEffect(() => {
    if (!isPending && isSuccess) {
      const appVersion = Application.nativeApplicationVersion ?? '1.0.0'
      const appVersionParts = appVersion.split('.').map(Number)
      const majorVersion = appVersionParts[0]
      const minorVersion = appVersionParts[1]
      const patchVersion = appVersionParts[2]

      if (
        apkVersion &&
        (majorVersion < apkVersion.majorVersion ||
          minorVersion < apkVersion.minorVersion ||
          patchVersion < apkVersion.patchVersion)
      ) {
        updateApp(apkVersion.downloadUrl).finally(() => setIsUpdated(true))
      } else {
        setIsUpdated(true)
      }
    }
  }, [apkVersion, isPending, isSuccess])

  return (
    <AppUpdateContext.Provider value={{ isUpdated: isUpdated }}>
      {children}
    </AppUpdateContext.Provider>
  )
}

export default AppUpdateProvider
