import { useEffect, useState } from "react";

import { DeviceType, getDeviceTypeAsync } from "expo-device";

export const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    getDeviceTypeAsync().then((deviceType: DeviceType) => {
      setIsMobile(deviceType === DeviceType.PHONE);
      setIsTablet(deviceType === DeviceType.TABLET);
    });
  }, []);

  return { isMobile, isTablet };
};
