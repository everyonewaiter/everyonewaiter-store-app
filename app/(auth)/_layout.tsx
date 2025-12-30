import { Redirect, Stack } from "expo-router";

import { useAuthentication } from "@/providers/AuthenticationProvider";

const AuthenticationLayout = () => {
  const { isAuthenticated } = useAuthentication();

  if (!isAuthenticated) {
    return <Redirect href="/device/registration-step1" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="waiting" options={{ headerShown: false }} />
      <Stack.Screen name="table" options={{ headerShown: false }} />
      <Stack.Screen name="hall" options={{ headerShown: false }} />
      <Stack.Screen name="pos" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthenticationLayout;
