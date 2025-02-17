import { Text, View } from 'react-native'

import { queryClient } from '@/api'
import Button from '@/components/Button'
import { queryKeys, storageKeys } from '@/constants'
import { Device } from '@/types'
import { getItem, removeItem } from '@/utils'

const Index = () => {
  const printStorage = async () => {
    console.log('Device', await getItem<Device>(storageKeys.DEVICE))
    console.log('DeviceId', await getItem<string>(storageKeys.DEVICE_ID))
    console.log('SecretKey', await getItem<string>(storageKeys.SECRET_KEY))
    console.log('StoreId', await getItem<string>(storageKeys.STORE_ID))
    console.log('UserId', await getItem<string>(storageKeys.USER_ID))
  }

  const handleSignOut = async () => {
    await Promise.all([
      removeItem(storageKeys.DEVICE),
      removeItem(storageKeys.DEVICE_ID),
      removeItem(storageKeys.SECRET_KEY),
      removeItem(storageKeys.STORE_ID),
      removeItem(storageKeys.USER_ID),
    ]).then(() => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
      })
    })
  }

  return (
    <View>
      <Text>홈</Text>
      <View style={{ marginVertical: 20 }}>
        <Button label={'정보 출력'} onPress={printStorage} />
      </View>
      <Button label={'인증 해제'} onPress={handleSignOut} />
    </View>
  )
}

export default Index
