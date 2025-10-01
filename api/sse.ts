import EventSource from 'react-native-sse'

import { queryClient } from '@/api/queryClient'
import { milliTimes, queryKeys, storageKeys } from '@/constants'
import { SseEvent } from '@/types'
import { getItem, makeSignature } from '@/utils'

type SseName = 'sse'

export class SseService {
  private static REQUEST_METHOD = 'GET'
  private static REQUEST_URI = '/v1/stores/subscribe'

  private eventSource: EventSource<SseName> | null = null
  private deviceId: string = ''
  private secretKey: string = ''
  private timestamp: string = Date.now().toString()
  private timestampInterval: number | null = null
  private isConnected: boolean = false

  constructor() {
    this.timestampInterval = setInterval(() => {
      this.timestamp = Date.now().toString()
    }, milliTimes.THIRTY_SECONDS + milliTimes.FIVE_SECONDS)
  }

  private async init(): Promise<void> {
    await Promise.all([this.setDeviceId(), this.setSecretKey()])
  }

  private async setDeviceId(): Promise<void> {
    const deviceId = await getItem<string>(storageKeys.DEVICE_ID)

    if (!deviceId) {
      throw new Error('Failed to initialize device ID')
    }

    this.deviceId = deviceId
  }

  private async setSecretKey(): Promise<void> {
    const secretKey = await getItem<string>(storageKeys.SECRET_KEY)

    if (!secretKey) {
      throw new Error('Failed to initialize secret key')
    }

    this.secretKey = secretKey
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return
    }

    await this.init()

    const url = new URL(
      process.env.EXPO_PUBLIC_API_SERVER_URL + SseService.REQUEST_URI,
    )

    this.eventSource = new EventSource<SseName>(url, {
      headers: {
        'x-ew-access-key': {
          toString: () => this.deviceId,
        },
        'x-ew-signature': {
          toString: () =>
            makeSignature(
              SseService.REQUEST_METHOD,
              SseService.REQUEST_URI,
              this.deviceId,
              this.secretKey,
              this.timestamp,
            ),
        },
        'x-ew-timestamp': {
          toString: () => this.timestamp,
        },
      },
    })

    this.eventSource.addEventListener('sse', event => {
      if (!event.data || event.data === 'CONNECTED!') {
        return
      }

      const sseEvent: SseEvent = JSON.parse(event.data)
      switch (sseEvent.category) {
        case 'DEVICE':
          queryClient.invalidateQueries({ queryKey: [queryKeys.DEVICE] })
          break
        case 'STORE':
          queryClient.invalidateQueries({ queryKey: [queryKeys.STORE] })
          break
        case 'CATEGORY':
          queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] })
          break
        case 'MENU':
          queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] })
          break
        case 'WAITING':
          queryClient.invalidateQueries({ queryKey: [queryKeys.WAITING] })
          break
        case 'ORDER':
          queryClient.invalidateQueries({ queryKey: [queryKeys.ORDER] })
          break
        case 'STAFF_CALL':
          break
        case 'RECEIPT':
          break
        case 'POS':
          break
        default:
          throw new Error(`Unhandled store action event: ${sseEvent}`)
      }
    })

    this.isConnected = true
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.removeAllEventListeners()
      this.eventSource.close()
      this.eventSource = null
      this.isConnected = false
    }

    if (this.timestampInterval) {
      clearInterval(this.timestampInterval)
      this.timestampInterval = null
    }
  }
}
