import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

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
  const [isUpdateFinished, setIsUpdateFinished] = useState(false);
  const { apkVersion, isSuccess, isPending } = useGetApkVersion();

  const isLoaded = !isPending && isSuccess;
  const appVersion = Application.nativeApplicationVersion ?? "1.0.0";
  const appVersionParts = appVersion.split(".").map(Number);
  const [majorVersion, minorVersion, patchVersion] = appVersionParts;

  const newerApkVersion =
    isLoaded &&
    apkVersion &&
    (majorVersion < apkVersion.majorVersion ||
      (majorVersion === apkVersion.majorVersion &&
        (minorVersion < apkVersion.minorVersion ||
          (minorVersion === apkVersion.minorVersion && patchVersion < apkVersion.patchVersion))))
      ? apkVersion
      : undefined;

  useEffect(() => {
    if (newerApkVersion) {
      updateApp(newerApkVersion.downloadUrl).finally(() => setIsUpdateFinished(true));
    }
  }, [newerApkVersion]);

  const isUpdated = (isLoaded && !newerApkVersion) || isUpdateFinished;

  return <AppUpdateContext.Provider value={{ isUpdated }}>{children}</AppUpdateContext.Provider>;
};

export default AppUpdateProvider;
