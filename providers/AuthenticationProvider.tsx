import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { storageKeys } from "@/constants/keys";
import { useGetDevice } from "@/hooks/useDeviceApi";
import { Device } from "@/types/device";
import { getItemOrElseThrow } from "@/utils/storage";

interface AuthenticationContextProps {
  device: Device | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  secretKey: string;
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  device: null,
  isAuthenticated: false,
  isLoading: false,
  secretKey: "",
});

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }

  return context;
};

const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const [secretKey, setSecretKey] = useState("");
  const { device, isSuccess, isPending } = useGetDevice();

  useEffect(() => {
    if (isSuccess) {
      const getSecretKey = async () => {
        const findSecretKey = await getItemOrElseThrow<string>(storageKeys.SECRET_KEY);
        setSecretKey(findSecretKey);
      };
      getSecretKey();
    }
  }, [isSuccess]);

  return (
    <AuthenticationContext.Provider
      value={{
        device: device ?? null,
        isAuthenticated: isSuccess,
        isLoading: isPending,
        secretKey,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
