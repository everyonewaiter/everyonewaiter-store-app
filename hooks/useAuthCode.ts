import { useState } from "react";

import { milliTimes } from "@/constants/times";
import { useSendAuthCode, useVerifyAuthCode } from "@/hooks/useDeviceApi";
import useInterval from "@/hooks/useInterval";

interface SendAuthCodeProps {
  phoneNumber: string;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}

interface VerifyAuthCodeProps {
  code: string;
  phoneNumber: string;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}

const useAuthCode = () => {
  const [authTime, setAuthTime] = useState(milliTimes.FIVE_MINUTE);
  const [isSendAuthCode, setIsSendAuthCode] = useState(false);
  const [isVerifyAuthCode, setIsVerifyAuthCode] = useState(false);

  const sendAuthCode = useSendAuthCode();
  const verifyAuthCode = useVerifyAuthCode();

  useInterval(() => {
    if (isSendAuthCode && !isVerifyAuthCode && authTime > 0) {
      setAuthTime((prev) => prev - milliTimes.ONE_SECOND);
    }

    if (isSendAuthCode && !isVerifyAuthCode && authTime <= 0) {
      setIsSendAuthCode(false);
      setAuthTime(milliTimes.FIVE_MINUTE);
    }
  }, milliTimes.ONE_SECOND);

  const sendAuthenticationCode = ({
    phoneNumber,
    successCallback = () => {},
    errorCallback = () => {},
  }: SendAuthCodeProps) => {
    sendAuthCode.mutate(
      {
        phoneNumber,
      },
      {
        onSuccess: () => {
          setIsSendAuthCode(true);
          successCallback();
        },
        onError: (error) => {
          setIsSendAuthCode(false);
          errorCallback(error);
        },
        onSettled: () => {
          setIsVerifyAuthCode(false);
          setAuthTime(milliTimes.FIVE_MINUTE);
        },
      }
    );
  };

  const verifyAuthenticationCode = ({
    code,
    phoneNumber,
    successCallback = () => {},
    errorCallback = () => {},
  }: VerifyAuthCodeProps) => {
    verifyAuthCode.mutate(
      {
        code,
        phoneNumber,
      },
      {
        onSuccess: () => {
          setIsVerifyAuthCode(true);
          setAuthTime(milliTimes.ZERO);
          successCallback();
        },
        onError: (error) => {
          setIsVerifyAuthCode(false);
          errorCallback(error);
        },
      }
    );
  };

  const resetAllState = () => {
    setIsSendAuthCode(false);
    setIsVerifyAuthCode(false);
    setAuthTime(milliTimes.FIVE_MINUTE);
  };

  return {
    authTime,
    isSendAuthCode,
    isVerifyAuthCode,
    sendAuthenticationCode,
    verifyAuthenticationCode,
    resetAllState,
  };
};

export default useAuthCode;
