import { createContext, PropsWithChildren, useContext } from "react";

import { useGetDevice } from "@/hooks/useDeviceApi";
import { Device } from "@/types/device";

interface AuthenticationContextProps {
  device: Device | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextProps>({
  device: null,
  isAuthenticated: false,
  isLoading: false,
});

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }

  return context;
};

const AuthenticationProvider = ({ children }: PropsWithChildren) => {
  const { device, isSuccess, isPending } = useGetDevice();

  return (
    <AuthenticationContext.Provider
      value={{
        device: device ?? null,
        isAuthenticated: isSuccess,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
