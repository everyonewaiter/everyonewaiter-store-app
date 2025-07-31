import { Alert } from 'react-native'

import * as FileSystem from 'expo-file-system'
import { startActivityAsync } from 'expo-intent-launcher'

export const updateApp = async (downloadUrl: string) => {
  const localUrl = FileSystem.documentDirectory + 'release.apk'

  try {
    await FileSystem.downloadAsync(downloadUrl, localUrl)

    const intentUrl = await FileSystem.getContentUriAsync(localUrl)
    await startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
      data: intentUrl,
      flags: 1,
    })
  } catch (error: any) {
    console.log(error)
    Alert.alert(
      '알림',
      '앱 업데이트에 실패했습니다.\n앱을 종료 후 다시 시도해 주세요.',
      [{ text: '확인' }],
    )
  }
}
