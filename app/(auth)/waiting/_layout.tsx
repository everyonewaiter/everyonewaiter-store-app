import { useCallback } from "react";

import { Redirect, Stack, useFocusEffect } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";

import { colors } from "@/constants/colors";
import { useAuthentication } from "@/contexts/AuthenticationContext";
import { useOrientation } from "@/hooks/useOrientation";
import { getNavigatePath } from "@/utils/navigate";

const WaitingLayout = () => {
  const { device } = useAuthentication();
  const { lockOrientation, unlockOrientation } = useOrientation();

  useFocusEffect(
    useCallback(() => {
      lockOrientation(OrientationLock.LANDSCAPE_RIGHT);
      return () => unlockOrientation();
    }, [lockOrientation, unlockOrientation])
  );

  if (!device) {
    return null;
  }

  if (device.purpose !== "WAITING") {
    return <Redirect href={`${getNavigatePath(device)}`} />;
  }

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}>
      <Stack.Screen name="registration" options={{ headerShown: false }} />
    </Stack>
  );
};

export default WaitingLayout;
