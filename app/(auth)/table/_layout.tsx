import { useCallback } from "react";

import { Redirect, Stack, useFocusEffect } from "expo-router";
import { OrientationLock } from "expo-screen-orientation";

import { colors } from "@/constants/colors";
import { useAuthentication } from "@/contexts/AuthenticationContext";
import { useOrientation } from "@/hooks/useOrientation";
import { getNavigatePath } from "@/utils/support";

const CustomerTableLayout = () => {
  const { lockOrientation, unlockOrientation } = useOrientation();
  const { device } = useAuthentication();

  useFocusEffect(
    useCallback(() => {
      void lockOrientation(OrientationLock.LANDSCAPE_RIGHT);
      return () => unlockOrientation();
    }, [lockOrientation, unlockOrientation])
  );

  if (!device) {
    return null;
  }

  if (device.purpose !== "TABLE") {
    return <Redirect href={`${getNavigatePath(device.purpose)}`} />;
  }

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}>
      <Stack.Screen name="customer" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CustomerTableLayout;
