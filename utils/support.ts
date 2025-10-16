import { ForwardedRef } from "react";

import { isAxiosError } from "axios";
import CryptoJS from "crypto-js";

import { storageKeys } from "@/constants/keys";
import { getItemOrElseThrow } from "@/utils/storage";

export const parseErrorMessage = (error: Error) => {
  if (isAxiosError(error)) {
    return error.response?.data.message ?? error.message;
  }
  return error.message;
};

export const mergeRefs = <T>(...refs: ForwardedRef<T>[]) => {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };
};

export const makeSignatureHeader = async (requestMethod: string, requestURI: string) => {
  const [deviceId, secretKey] = await Promise.all([
    getItemOrElseThrow<string>(storageKeys.DEVICE_ID),
    getItemOrElseThrow<string>(storageKeys.SECRET_KEY),
  ]);

  const accessKey = deviceId;
  const timestamp = Date.now().toString();
  const signature = makeSignature(requestMethod, requestURI, deviceId, secretKey, timestamp);

  return {
    "x-ew-access-key": accessKey,
    "x-ew-signature": signature,
    "x-ew-timestamp": timestamp,
  };
};

export const makeSignature = (
  requestMethod: string,
  requestURI: string,
  deviceId: string,
  secretKey: string,
  timestamp: string
) => {
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(`${requestMethod} ${requestURI}`);
  hmac.update("\n");
  hmac.update(`${deviceId}`);
  hmac.update("\n");
  hmac.update(timestamp);
  const hash = hmac.finalize();
  return hash.toString(CryptoJS.enc.Base64);
};
