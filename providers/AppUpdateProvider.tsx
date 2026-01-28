import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import * as Application from "expo-application";

import { useGetApkVersion } from "@/hooks/useHealthApi";
import { updateApp } from "@/utils/update";

interface AuthenticationContextProps {
  isUpdated: boolean;
}

const AppUpdateContext = createContext<AuthenticationContextProps>({
  isUpdated: false,
});

export const useAppUpdate = () => {
  const context = useContext(AppUpdateContext);

  if (!context) {
    throw new Error("useAppUpdate must be used within an AppUpdateProvider");
  }

  return context;
};

const AppUpdateProvider = ({ children }: PropsWithChildren) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const { apkVersion, isSuccess, isPending } = useGetApkVersion();

  useEffect(() => {
    if (!isPending && isSuccess) {
      const appVersion = Application.nativeApplicationVersion ?? "1.0.0";
      const appVersionParts = appVersion.split(".").map(Number);
      const [majorVersion, minorVersion, patchVersion] = appVersionParts;

      if (
        apkVersion &&
        (majorVersion < apkVersion.majorVersion ||
          minorVersion < apkVersion.minorVersion ||
          patchVersion < apkVersion.patchVersion)
      ) {
        updateApp(apkVersion.downloadUrl).finally(() => setIsUpdated(true));
      } else {
        setIsUpdated(true);
      }
    }
  }, [apkVersion, isPending, isSuccess]);

  const memo = useMemo(() => ({ isUpdated }), [isUpdated]);

  return <AppUpdateContext.Provider value={memo}>{children}</AppUpdateContext.Provider>;
};

export default AppUpdateProvider;
