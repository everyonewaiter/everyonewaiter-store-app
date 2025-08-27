import { createContext, PropsWithChildren, useEffect, useRef } from 'react'
import EventSource from 'react-native-sse'

import 'react-native-url-polyfill/auto'

import { queryClient } from '@/api'
import { milliTimes, queryKeys, storageKeys } from '@/constants'
import { useAuthentication } from '@/contexts/AuthenticationContext'
import { SseEvent } from '@/types'
import { getItem, makeSignature } from '@/utils'

type SseName = 'sse'

const SseContext = createContext(null)

const SseProvider = ({ children }: PropsWithChildren) => {
  const { device, isAuthenticated } = useAuthentication()
  const secretKeyRef = useRef('')
  const timestampRef = useRef(Date.now().toString())

  useEffect(() => {
    const getSecretKey = async () => {
      secretKeyRef.current =
        (await getItem<string>(storageKeys.SECRET_KEY)) || ''
    }
    void getSecretKey()

    const interval = setInterval(() => {
      timestampRef.current = Date.now().toString()
    }, milliTimes.THIRTY_SECONDS + milliTimes.FIVE_SECONDS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const requestMethod = 'GET'
    const requestURI = '/v1/stores/subscribe'
    const sseEndpoint = process.env.EXPO_PUBLIC_API_SERVER_URL + requestURI
    if (!device || !isAuthenticated) {
      return
    }

    const url = new URL(sseEndpoint)
    const eventSource = new EventSource<SseName>(url, {
      headers: {
        'x-ew-access-key': {
          toString: () => device.deviceId,
        },
        'x-ew-signature': {
          toString: () =>
            makeSignature(
              requestMethod,
              requestURI,
              device.deviceId,
              secretKeyRef.current,
              timestampRef.current,
            ),
        },
        'x-ew-timestamp': {
          toString: () => timestampRef.current,
        },
      },
    })

    eventSource.addEventListener('sse', event => {
      if (!event.data) {
        return
      }

      if (event.data === 'CONNECTED!') {
        return
      }

      const sseEvent: SseEvent = JSON.parse(event.data)
      switch (sseEvent.category) {
        case 'DEVICE':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.DEVICE] })
          break
        case 'STORE':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.STORE] })
          break
        case 'CATEGORY':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] })
          break
        case 'MENU':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] })
          break
        case 'WAITING':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.WAITING] })
          break
        case 'ORDER':
          void queryClient.invalidateQueries({ queryKey: [queryKeys.ORDER] })
          break
        case 'STAFF_CALL':
          break
        case 'RECEIPT':
          break
        case 'POS':
          break
        default:
          console.log('Unhandled store action event:', sseEvent)
      }
    })

    return () => {
      eventSource.removeAllEventListeners()
      eventSource.close()
    }
  }, [device, isAuthenticated])

  return <SseContext.Provider value={null}>{children}</SseContext.Provider>
}

export default SseProvider
