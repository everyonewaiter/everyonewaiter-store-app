import { Redirect, Stack } from "expo-router";

import { colors } from "@/constants/colors";
import { useAuthentication } from "@/providers/AuthenticationProvider";
import { getNavigatePath } from "@/utils/navigate";

const HallLayout = () => {
  const { device } = useAuthentication();

  if (!device) {
    return null;
  }

  if (device.purpose !== "HALL") {
    return <Redirect href={`${getNavigatePath(device)}`} />;
  }

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.GRAY7_F1 } }}>
      <Stack.Screen name="management" options={{ headerShown: false }} />
    </Stack>
  );
};

export default HallLayout;
