import React, { useEffect, useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import dayjs from "dayjs";

import { queryClient } from "@/api";
import Button from "@/components/Button";
import DevicePurposeSelectBox from "@/components/DevicePurposeSelectBox";
import Input from "@/components/Input";
import InputLabel from "@/components/InputLabel";
import PaymentTypeSelectBox from "@/components/PaymentTypeSelectBox";
import { DevicePurpose, fonts, PaymentType, queryKeys, storageKeys } from "@/constants";
import { useCreateDevice } from "@/hooks/useCreateDevice";
import { Entries } from "@/types";
import { parseErrorMessage, setItem, validateCreateDevice } from "@/utils";

type RegistrationPageParams = {
  accountId: string;
  storeId: string;
  phoneNumber: string;
};

type SelectPurpose = Pick<typeof DevicePurpose, "TABLE" | "WAITING">;

interface RegistrationForm {
  name: RegistrationFormProps;
  tableNo: RegistrationFormProps;
}

interface RegistrationFormProps {
  value: string;
  error: string;
}

const generateDeviceName = (selectedPurpose: keyof SelectPurpose) => {
  const timestamp = dayjs().format("YYMMDDHHmm");
  let name = timestamp;

  switch (selectedPurpose) {
    case "TABLE":
      name = "1번 테이블";
      break;
    case "WAITING":
      name = `웨이팅-${timestamp}`;
      break;
  }

  return name;
};

const RegistrationStep2Screen = () => {
  const [selectedPurpose, setSelectedPurpose] = useState<keyof SelectPurpose>("TABLE");
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<keyof typeof PaymentType>("POSTPAID");
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: { value: "", error: "" },
    tableNo: { value: "1", error: "" },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { accountId, storeId, phoneNumber } = useLocalSearchParams<RegistrationPageParams>();
  const createDevice = useCreateDevice();

  useEffect(() => {
    if (!accountId || !storeId || !phoneNumber) {
      router.replace("/device/registration-step1");
    }
  }, [accountId, storeId, phoneNumber]);

  useEffect(() => {
    setRegistrationForm((prev) => ({
      ...prev,
      name: {
        value: generateDeviceName(selectedPurpose),
        error: prev.name.error,
      },
    }));
  }, [selectedPurpose]);

  const handleOnChangeTableNo = (value: string) => {
    const parsedTableNo = parseInt(value, 10);
    const tableNo = isNaN(parsedTableNo) ? value : parsedTableNo;
    setRegistrationForm({
      name: { value: `${tableNo}번 테이블`, error: "" },
      tableNo: { value: tableNo.toString(), error: "" },
    });
  };

  const handleOnChangeName = (value: string) => {
    setRegistrationForm((prev) => ({
      ...prev,
      name: { value, error: "" },
    }));
  };

  const handleOnError = (key: keyof RegistrationForm, error: string) => {
    if (error) {
      setRegistrationForm((prev) => ({
        ...prev,
        [key]: { value: prev[key].value, error },
      }));
    }
  };

  const handleSubmit = () => {
    const { hasError, error } = validateCreateDevice(
      selectedPurpose,
      registrationForm.name.value,
      registrationForm.tableNo.value
    );

    if (hasError) {
      handleOnError("name", error.name);
      handleOnError("tableNo", error.tableNo);
      return;
    }

    setIsLoading(true);
    createDevice.mutate(
      {
        storeId: storeId,
        phoneNumber,
        name: registrationForm.name.value,
        purpose: selectedPurpose,
        tableNo: parseInt(registrationForm.tableNo.value, 10),
        paymentType: selectedPaymentType,
      },
      {
        onSuccess: ({ deviceId, secretKey }) => {
          Promise.all([
            setItem<string>(storageKeys.DEVICE_ID, deviceId),
            setItem<string>(storageKeys.SECRET_KEY, secretKey),
            setItem<string>(storageKeys.STORE_ID, storeId),
          ]).then(() => {
            void queryClient.invalidateQueries({
              queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
            });
            router.replace("/");
          });
        },
        onError: (error) => {
          Alert.alert("에러", parseErrorMessage(error), [{ text: "확인" }]);
        },
        onSettled: () => setIsLoading(false),
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <KeyboardAwareScrollView bottomOffset={100} keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>기기 등록</Text>
              <Text>아래 버튼을 눌러 해당 기기의 용도를 선택하세요!</Text>
            </View>
            <View style={styles.selectBoxContainer}>
              <View style={styles.devicePurposeSelectBoxContainer}>
                {(
                  Object.entries({
                    TABLE: "손님 테이블",
                    WAITING: "웨이팅 등록",
                  }) as Entries<SelectPurpose>
                ).map(([key, value], index) => (
                  <DevicePurposeSelectBox
                    key={`${key}-${index}`}
                    label={value}
                    selected={selectedPurpose === key}
                    onPress={() => setSelectedPurpose(key)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.inputContainer}>
              {selectedPurpose === "TABLE" && (
                <Input
                  label="테이블 번호"
                  inputMode="numeric"
                  placeholder="테이블 번호를 입력해주세요."
                  value={registrationForm.tableNo.value}
                  error={registrationForm.tableNo.error}
                  onChangeText={handleOnChangeTableNo}
                  returnKeyType="done"
                />
              )}
              <Input
                label="기기 이름"
                placeholder="기기 이름을 입력해주세요."
                value={registrationForm.name.value}
                error={registrationForm.name.error}
                onChangeText={handleOnChangeName}
                returnKeyType="done"
              />
              {selectedPurpose === "TABLE" && (
                <View>
                  <InputLabel label="결제 수단" />
                  <View style={styles.paymentTypeSelectBoxContainer}>
                    {(Object.entries(PaymentType) as Entries<typeof PaymentType>).map(
                      ([key, value], index) => (
                        <PaymentTypeSelectBox
                          key={`${key}-${index}`}
                          label={value}
                          selected={selectedPaymentType === key}
                          onPress={() => setSelectedPaymentType(key)}
                        />
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
            <Button label="기기 등록" onPress={handleSubmit} disabled={isLoading} />
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: 480,
  },
  headerContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  headerTitle: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 24,
    fontWeight: "600",
  },
  headerDescription: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 18,
    fontWeight: "400",
  },
  selectBoxContainer: {
    marginBottom: 24,
  },
  devicePurposeSelectBoxContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  paymentTypeSelectBoxContainer: {
    flexDirection: "row",
    gap: 8,
  },
  inputContainer: {
    gap: 12,
    marginBottom: 32,
  },
});

export default RegistrationStep2Screen;
