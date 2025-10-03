import { useState } from "react";

import dayjs from "dayjs";

import { PaymentType, SupportPurpose } from "@/constants/domain";
import { ValueOf } from "@/types/utility";
import { validateDeviceName, validateTableNo } from "@/utils/validation";

export const DeviceStep2SelectorName = {
  PURPOSE: "purpose",
  PAYMENT_TYPE: "paymentType",
} as const;

export const DeviceStep2FormName = {
  NAME: "name",
  TABLE_NO: "tableNo",
} as const;

type FormNameValue = ValueOf<typeof DeviceStep2FormName>;
type PurposeKey = keyof typeof SupportPurpose;
type PaymentTypeKey = keyof typeof PaymentType;

interface Selector {
  [DeviceStep2SelectorName.PURPOSE]: PurposeKey;
  [DeviceStep2SelectorName.PAYMENT_TYPE]: PaymentTypeKey;
}

const initialSelector: Selector = {
  [DeviceStep2SelectorName.PURPOSE]: "TABLE",
  [DeviceStep2SelectorName.PAYMENT_TYPE]: "POSTPAID",
};

const initialForm = {
  [DeviceStep2FormName.NAME]: "1번 테이블",
  [DeviceStep2FormName.TABLE_NO]: "1",
};

const initialErrorMessage = {
  [DeviceStep2FormName.NAME]: "",
  [DeviceStep2FormName.TABLE_NO]: "",
};

const useDeviceStep2Form = () => {
  const [selector, setSelector] = useState(initialSelector);
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);

  const updateForm = (name: FormNameValue, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateErrorMessage = (name: FormNameValue, message: string) => {
    setErrorMessage((prev) => ({ ...prev, [name]: message }));
  };

  const isValidForm = (name: FormNameValue) => {
    return form[name].length > 0 && errorMessage[name].length === 0;
  };

  const handleOnChangePurpose = (value: PurposeKey) => {
    setSelector((prev) => ({ ...prev, [DeviceStep2SelectorName.PURPOSE]: value }));

    switch (value) {
      case "TABLE":
        handleOnChangeTableNoWithName("1");
        handleOnChangePaymentType("POSTPAID");
        break;
      case "WAITING":
        handleOnChangeName(`웨이팅-${dayjs().format("YYYYMMDDHHmmss")}`);
        handleOnChangeTableNo("1");
        handleOnChangePaymentType("POSTPAID");
        break;
    }
  };

  const handleOnChangePaymentType = (value: PaymentTypeKey) => {
    setSelector((prev) => ({ ...prev, [DeviceStep2SelectorName.PAYMENT_TYPE]: value }));
  };

  const handleOnChangeName = (value: string) => {
    const errorMessage = validateDeviceName(value);

    updateForm(DeviceStep2FormName.NAME, value);
    updateErrorMessage(DeviceStep2FormName.NAME, errorMessage);
  };

  const handleOnChangeTableNo = (value: string) => {
    const errorMessage = validateTableNo(value);

    updateForm(DeviceStep2FormName.TABLE_NO, value);
    updateErrorMessage(DeviceStep2FormName.TABLE_NO, errorMessage);
  };

  const handleOnChangeTableNoWithName = (value: string) => {
    handleOnChangeTableNo(value);
    handleOnChangeName(`${value}번 테이블`);
  };

  const isValid = {
    [DeviceStep2FormName.NAME]: isValidForm(DeviceStep2FormName.NAME),
    [DeviceStep2FormName.TABLE_NO]: isValidForm(DeviceStep2FormName.TABLE_NO),
  };

  return {
    selector,
    form,
    errorMessage,
    handleOnChange: {
      [DeviceStep2SelectorName.PURPOSE]: handleOnChangePurpose,
      [DeviceStep2SelectorName.PAYMENT_TYPE]: handleOnChangePaymentType,
      [DeviceStep2FormName.NAME]: handleOnChangeName,
      [DeviceStep2FormName.TABLE_NO]: handleOnChangeTableNoWithName,
    },
    isValid,
    isValidForm: Object.values(isValid).every(Boolean),
  };
};

export default useDeviceStep2Form;
