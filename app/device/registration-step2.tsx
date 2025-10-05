import React, { useEffect } from "react";
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import { useQueryClient } from "@tanstack/react-query";

import Button from "@/components/Button";
import DevicePurposeSelectBox from "@/components/DevicePurposeSelectBox";
import Input from "@/components/Input";
import InputLabel from "@/components/InputLabel";
import ErrorModal from "@/components/Modal/ErrorModal";
import PaymentTypeSelectBox from "@/components/PaymentTypeSelectBox";
import { PaymentType, SupportPurpose } from "@/constants/domain";
import { fonts } from "@/constants/fonts";
import { queryKeys, storageKeys } from "@/constants/keys";
import { useCreateDevice } from "@/hooks/useDeviceApi";
import useDeviceStep2Form, {
  DeviceStep2FormName,
  DeviceStep2SelectorName,
} from "@/hooks/useDeviceStep2Form";
import useModal from "@/hooks/useModal";
import { ModalName } from "@/stores/modal";
import { Entries } from "@/types/utility";
import { setItem } from "@/utils/storage";
import { parseErrorMessage } from "@/utils/support";

type RegistrationPageParams = {
  accountId: string;
  storeId: string;
  phoneNumber: string;
};

const RegistrationStep2Screen = () => {
  const queryClient = useQueryClient();
  const { accountId, storeId, phoneNumber } = useLocalSearchParams<RegistrationPageParams>();

  const { selector, form, errorMessage, handleOnChange, isValidForm } = useDeviceStep2Form();

  const { mutate, isPending } = useCreateDevice();

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (!accountId || !storeId || !phoneNumber) {
      router.replace("/device/registration-step1");
    }
  }, [accountId, storeId, phoneNumber]);

  const handleOnSubmit = () => {
    mutate(
      {
        storeId: storeId,
        phoneNumber,
        purpose: selector[DeviceStep2SelectorName.PURPOSE],
        paymentType: selector[DeviceStep2SelectorName.PAYMENT_TYPE],
        name: form[DeviceStep2FormName.NAME],
        tableNo: parseInt(form[DeviceStep2FormName.TABLE_NO], 10),
      },
      {
        onSuccess: ({ deviceId, secretKey }) => {
          Promise.all([
            setItem<string>(storageKeys.DEVICE_ID, deviceId),
            setItem<string>(storageKeys.SECRET_KEY, secretKey),
            setItem<string>(storageKeys.STORE_ID, storeId),
          ]).then(() => {
            queryClient.invalidateQueries({
              queryKey: [queryKeys.DEVICE, queryKeys.GET_DEVICE],
            });
          });
        },
        onError: (error) => {
          openModal(ModalName.DEVICE_CREATE_ERROR, ErrorModal, {
            title: "기기 등록 실패",
            message: parseErrorMessage(error),
            onClose: closeModal,
          });
        },
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
                {(Object.entries(SupportPurpose) as Entries<typeof SupportPurpose>).map(
                  ([key, value], index) => (
                    <DevicePurposeSelectBox
                      key={`${key}-${index}`}
                      label={value}
                      selected={selector[DeviceStep2SelectorName.PURPOSE] === key}
                      onPress={() => handleOnChange[DeviceStep2SelectorName.PURPOSE](key)}
                    />
                  )
                )}
              </View>
            </View>
            <View style={styles.inputContainer}>
              {selector[DeviceStep2SelectorName.PURPOSE] === "TABLE" && (
                <Input
                  label="테이블 번호"
                  inputMode="numeric"
                  placeholder="테이블 번호를 입력해주세요."
                  value={form[DeviceStep2FormName.TABLE_NO]}
                  error={errorMessage[DeviceStep2FormName.TABLE_NO]}
                  onChangeText={handleOnChange[DeviceStep2FormName.TABLE_NO]}
                  returnKeyType="done"
                />
              )}
              <Input
                label="기기 이름"
                placeholder="기기 이름을 입력해주세요."
                value={form[DeviceStep2FormName.NAME]}
                error={errorMessage[DeviceStep2FormName.NAME]}
                onChangeText={handleOnChange[DeviceStep2FormName.NAME]}
                returnKeyType="done"
              />
              {selector[DeviceStep2SelectorName.PURPOSE] === "TABLE" && (
                <View>
                  <InputLabel label="결제 수단" />
                  <View style={styles.paymentTypeSelectBoxContainer}>
                    {(Object.entries(PaymentType) as Entries<typeof PaymentType>).map(
                      ([key, value], index) => (
                        <PaymentTypeSelectBox
                          key={`${key}-${index}`}
                          label={value}
                          selected={selector[DeviceStep2SelectorName.PAYMENT_TYPE] === key}
                          onPress={() => handleOnChange[DeviceStep2SelectorName.PAYMENT_TYPE](key)}
                        />
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
            <Button
              label="기기 등록"
              onPress={handleOnSubmit}
              disabled={!isValidForm || isPending}
            />
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
