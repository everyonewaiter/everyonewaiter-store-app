import { createContext, PropsWithChildren, useEffect } from 'react'

import 'react-native-url-polyfill/auto'

import { SseService } from '@/api'
import { useAuthentication } from '@/contexts/AuthenticationContext'

const sseService = new SseService()

const SseContext = createContext(null)

const SseProvider = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuthentication()

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    ;(async () => {
      await sseService.connect()
    })()

    return () => sseService.disconnect()
  }, [isAuthenticated])

  return <SseContext.Provider value={null}>{children}</SseContext.Provider>
}

export default SseProvider
