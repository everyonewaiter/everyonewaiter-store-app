import { Alert, BackHandler } from "react-native";

import { File, Paths } from "expo-file-system";
import { startActivityAsync } from "expo-intent-launcher";

import * as Sentry from "@sentry/react-native";

export const updateApp = async (downloadUrl: string) => {
  const updateFile = new File(Paths.document, "release.apk");

  if (updateFile.exists) {
    updateFile.delete();
  }

  try {
    await File.downloadFileAsync(downloadUrl, updateFile);
    await startActivityAsync("android.intent.action.INSTALL_PACKAGE", {
      data: updateFile.contentUri,
      flags: 1,
    });
  } catch (error: unknown) {
    Sentry.captureException(error);
    Alert.alert("알림", "앱 업데이트에 실패했습니다.\n앱을 종료 후 다시 시도해 주세요.", [
      { text: "확인", onPress: () => BackHandler.exitApp() },
    ]);
  }
};
