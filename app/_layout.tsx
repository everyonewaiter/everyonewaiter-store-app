import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import * as Sentry from "@sentry/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/api/queryClient";
import { fontAssets } from "@/constants/fonts";
import AppUpdateProvider, { useAppUpdate } from "@/contexts/AppUpdateContext";
import AuthenticationProvider, { useAuthentication } from "@/contexts/AuthenticationContext";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useStickyImmersive } from "@/hooks/useStickyImmersive";
import "@/sentry.config";

SplashScreen.setOptions({ duration: 1000, fade: true });
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  useKeepAwake();
  useStickyImmersive();

  const { isMobile } = useDeviceType();

  if (isMobile) {
    Alert.alert("알림", "모바일 환경은 지원하지 않습니다.\n태블릿을 이용해 주세요.", [
      { text: "확인", onPress: () => BackHandler.exitApp() },
    ]);
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <GestureHandlerRootView>
          <AppUpdateProvider>
            <AuthenticationProvider>
              <EveryoneWaiterApplication />
            </AuthenticationProvider>
          </AppUpdateProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </QueryClientProvider>
  );
};

const EveryoneWaiterApplication = () => {
  const [loaded] = useFonts(fontAssets);
  const { isUpdated } = useAppUpdate();
  const { isLoading } = useAuthentication();

  useEffect(() => {
    if (loaded && isUpdated && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isUpdated, isLoading]);

  if (!loaded || !isUpdated || isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="device" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar hidden={true} />
    </>
  );
};

export default Sentry.wrap(RootLayout);
