import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";

import { storageKeys } from "@/constants/keys";
import { useGetDevice } from "@/hooks/useDeviceApi";
import { Device } from "@/types/device";
import { getItem } from "@/utils/storage";

interface AuthenticationContextProps {
  device: Device | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  secretKeyRef: React.RefObject<string>;
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  device: null,
  isAuthenticated: false,
  isLoading: false,
  secretKeyRef: { current: "" },
});

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }

  return context;
};

const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const secretKeyRef = useRef("");
  const { device, isSuccess, isPending } = useGetDevice();

  useEffect(() => {
    if (isSuccess) {
      const setSecretKey = async () => {
        secretKeyRef.current = (await getItem<string>(storageKeys.SECRET_KEY)) ?? "";
      };
      setSecretKey();
    } else {
      secretKeyRef.current = "";
    }
  }, [isSuccess]);

  return (
    <AuthenticationContext.Provider
      value={{
        device: device ?? null,
        isAuthenticated: isSuccess,
        isLoading: isPending,
        secretKeyRef,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
