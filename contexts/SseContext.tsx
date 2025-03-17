import { createContext, PropsWithChildren, useEffect, useRef } from 'react'
import EventSource from 'react-native-sse'

import JSONBig from 'json-bigint'
import 'react-native-url-polyfill/auto'

import { queryClient } from '@/api'
import { milliTimes, queryKeys, storageKeys } from '@/constants'
import { useGetDevice } from '@/hooks'
import { StoreActionEvent } from '@/types'
import { getItem, makeSignature } from '@/utils'

type SseEvent = 'sse'

const SseContext = createContext(null)

const handleStoreActionEvent = (storeAction: string | StoreActionEvent) => {
  if (typeof storeAction === 'string') {
    return
  }

  switch (storeAction.category) {
    case '기기':
      void queryClient.invalidateQueries({ queryKey: [queryKeys.DEVICE] })
      break
    case '매장':
      void queryClient.invalidateQueries({ queryKey: [queryKeys.STORE] })
      break
    case '설정':
      void queryClient.invalidateQueries({ queryKey: [queryKeys.SETTING] })
      break
    case '카테고리':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    case '메뉴':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    case '웨이팅':
      void queryClient.invalidateQueries({ queryKey: [queryKeys.WAITING] })
      break
    case '주문':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    case '직원 호출':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    case '레시피':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    case 'POS':
      console.log(
        'Not implemented yet store action event:',
        storeAction.category,
      )
      break
    default:
      console.log('Unhandled store action event:', storeAction)
  }
}

const SseProvider = ({ children }: PropsWithChildren) => {
  const { device } = useGetDevice()
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
    const sseEndpoint = process.env.EXPO_PUBLIC_SSE_SERVER_URL
    if (!sseEndpoint || !device || !secretKeyRef.current) {
      return
    }

    const url = new URL(sseEndpoint)
    const eventSource = new EventSource<SseEvent>(url, {
      headers: {
        'x-ew-access-key': {
          toString: () => device.id.toString(),
        },
        'x-ew-signature': {
          toString: () =>
            makeSignature(device, secretKeyRef.current, timestampRef.current),
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
      const storeAction: StoreActionEvent = JSONBig.parse(event.data)
      handleStoreActionEvent(storeAction)
    })

    return () => {
      eventSource.removeAllEventListeners()
      eventSource.close()
    }
  }, [device])

  return <SseContext.Provider value={null}>{children}</SseContext.Provider>
}

export default SseProvider
