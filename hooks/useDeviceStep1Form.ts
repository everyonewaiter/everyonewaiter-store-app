import { useState } from "react";

import { ValueOf } from "@/types/utility";
import { formatPhoneNumberWithPrefix } from "@/utils/format";
import { validateAuthCode, validatePhoneNumber } from "@/utils/validation";

export const DeviceStep1FormName = {
  PHONE_NUMBER: "phoneNumber",
  AUTH_CODE: "code",
} as const;

type FormKey = ValueOf<typeof DeviceStep1FormName>;

const initialForm = {
  [DeviceStep1FormName.PHONE_NUMBER]: "",
  [DeviceStep1FormName.AUTH_CODE]: "",
};

const initialErrorMessage = {
  [DeviceStep1FormName.PHONE_NUMBER]: "",
  [DeviceStep1FormName.AUTH_CODE]: "",
};

const useDeviceStep1Form = () => {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);

  const updateForm = (name: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateErrorMessage = (name: FormKey, message: string) => {
    setErrorMessage((prev) => ({ ...prev, [name]: message }));
  };

  const isValidForm = (name: FormKey) => {
    return form[name].length > 0 && errorMessage[name].length === 0;
  };

  const handleOnChangePhone = (value: string) => {
    const errorMessage = validatePhoneNumber(value);

    updateForm(DeviceStep1FormName.PHONE_NUMBER, formatPhoneNumberWithPrefix(value));
    updateErrorMessage(DeviceStep1FormName.PHONE_NUMBER, errorMessage);
  };

  const handleOnChangeAuthCode = (value: string) => {
    const errorMessage = validateAuthCode(value);

    updateForm(DeviceStep1FormName.AUTH_CODE, value);
    updateErrorMessage(DeviceStep1FormName.AUTH_CODE, errorMessage);
  };

  const handleOnErrorPhone = (message: string) => {
    updateErrorMessage(DeviceStep1FormName.PHONE_NUMBER, message);
  };

  const handleOnErrorAuthCode = (message: string) => {
    updateErrorMessage(DeviceStep1FormName.AUTH_CODE, message);
  };

  return {
    form,
    errorMessage,
    handleOnChange: {
      [DeviceStep1FormName.PHONE_NUMBER]: handleOnChangePhone,
      [DeviceStep1FormName.AUTH_CODE]: handleOnChangeAuthCode,
    },
    handleOnError: {
      [DeviceStep1FormName.PHONE_NUMBER]: handleOnErrorPhone,
      [DeviceStep1FormName.AUTH_CODE]: handleOnErrorAuthCode,
    },
    isValid: {
      [DeviceStep1FormName.PHONE_NUMBER]: isValidForm(DeviceStep1FormName.PHONE_NUMBER),
      [DeviceStep1FormName.AUTH_CODE]: isValidForm(DeviceStep1FormName.AUTH_CODE),
    },
  };
};

export default useDeviceStep1Form;
