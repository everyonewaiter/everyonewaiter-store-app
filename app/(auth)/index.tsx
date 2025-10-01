import { Redirect } from "expo-router";

import { useAuthentication } from "@/contexts/AuthenticationContext";
import { getNavigatePathOrNull } from "@/utils/navigate";

const AuthenticationNavigator = () => {
  const { device } = useAuthentication();

  const navigatePath = getNavigatePathOrNull(device);

  return navigatePath ? <Redirect href={navigatePath} /> : null;
};

export default AuthenticationNavigator;
