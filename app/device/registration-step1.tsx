import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import Button from "@/components/Button";
import Input from "@/components/Input";
import InputLabel from "@/components/InputLabel";
import ErrorModal from "@/components/Modal/ErrorModal";
import Picker from "@/components/Picker";
import { fonts } from "@/constants/fonts";
import { milliTimes } from "@/constants/times";
import { useGetProfile } from "@/hooks/useAccountApi";
import useAuthCode from "@/hooks/useAuthCode";
import useDeviceStep1Form, { DeviceStep1FormName } from "@/hooks/useDeviceStep1Form";
import useModal from "@/hooks/useModal";
import { useGetStores } from "@/hooks/useStoreApi";
import { ModalName } from "@/stores/modal";
import { formatPhoneNumberOnlyNumber, formatTime } from "@/utils/format";
import { parseErrorMessage } from "@/utils/support";

const RegistrationStep1Screen = () => {
  const phoneNumberRef = useRef<TextInput | null>(null);
  const authenticationCodeRef = useRef<TextInput | null>(null);

  const {
    form,
    errorMessage,
    handleOnChange,
    handleOnError,
    isValid,
    isValidForm,
    resetAllState: resetForm,
  } = useDeviceStep1Form();
  const unformattedPhone = formatPhoneNumberOnlyNumber(form[DeviceStep1FormName.PHONE_NUMBER]);

  const {
    authTime,
    isSendAuthCode,
    isVerifyAuthCode,
    sendAuthenticationCode,
    verifyAuthenticationCode,
    isPendingSendAuthCode,
    isPendingVerifyAuthCode,
    resetAllState: resetAuth,
  } = useAuthCode();
  const minimumIdleTime = milliTimes.FIVE_MINUTE - milliTimes.THIRTY_SECONDS;

  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  const { data: profile } = useGetProfile(unformattedPhone, isVerifyAuthCode);
  const { accountId } = profile || {};
  const { data: stores } = useGetStores(accountId, isVerifyAuthCode);

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    if (stores && stores.length > 0) {
      setSelectedStoreId(stores[0].storeId);
    }
    if (stores && stores.length === 0) {
      openModal(ModalName.STORE_IS_EMPTY, ErrorModal, {
        title: "알림",
        message: "매장을 먼저 등록해주세요.",
        onClose: () => {
          resetForm();
          resetAuth();
          setSelectedStoreId("");
          closeModal();
        },
      });
    }
  }, [stores, openModal, closeModal, resetForm, resetAuth]);

  const handleOnSubmitSendAuthCode = () => {
    sendAuthenticationCode({
      phoneNumber: unformattedPhone,
      successCallback: () => {
        handleOnChange[DeviceStep1FormName.AUTH_CODE]("");
        authenticationCodeRef.current?.focus();
      },
      errorCallback: (error) => {
        handleOnError[DeviceStep1FormName.PHONE_NUMBER](parseErrorMessage(error));
        phoneNumberRef.current?.focus();
      },
    });
  };

  const handleOnSubmitVerifyAuthCode = () => {
    verifyAuthenticationCode({
      code: form[DeviceStep1FormName.AUTH_CODE],
      phoneNumber: unformattedPhone,
      errorCallback: (error) => {
        handleOnError[DeviceStep1FormName.AUTH_CODE](parseErrorMessage(error));
        authenticationCodeRef.current?.focus();
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>기기 등록</Text>
            </View>
            <View style={styles.sectionContainer}>
              <View>
                <InputLabel label="휴대폰 번호" />
                <View style={styles.inputWithButtonContainer}>
                  <View style={styles.inputContainer}>
                    <Input
                      ref={phoneNumberRef}
                      inputMode="numeric"
                      placeholder="사장님 계정에 등록된 전화번호를 입력해주세요."
                      value={form[DeviceStep1FormName.PHONE_NUMBER]}
                      error={errorMessage[DeviceStep1FormName.PHONE_NUMBER]}
                      onChangeText={handleOnChange[DeviceStep1FormName.PHONE_NUMBER]}
                      returnKeyType="done"
                      disabled={isVerifyAuthCode}
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      label={isSendAuthCode ? "재요청" : "인증요청"}
                      size="medium"
                      onPress={handleOnSubmitSendAuthCode}
                      disabled={
                        !isValid[DeviceStep1FormName.PHONE_NUMBER] ||
                        (isSendAuthCode && authTime >= minimumIdleTime) ||
                        isPendingSendAuthCode ||
                        isVerifyAuthCode
                      }
                    />
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.inputWithButtonContainer}>
                  <View style={styles.inputContainer}>
                    <Input
                      ref={authenticationCodeRef}
                      inputMode="numeric"
                      placeholder="인증번호를 입력해주세요."
                      right={isSendAuthCode ? `${formatTime(authTime)}` : ""}
                      value={form[DeviceStep1FormName.AUTH_CODE]}
                      error={errorMessage[DeviceStep1FormName.AUTH_CODE]}
                      onChangeText={handleOnChange[DeviceStep1FormName.AUTH_CODE]}
                      disabled={isVerifyAuthCode}
                      returnKeyType="done"
                      autoComplete="one-time-code"
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      label="확인"
                      size="medium"
                      onPress={handleOnSubmitVerifyAuthCode}
                      disabled={
                        !isSendAuthCode ||
                        !isValidForm ||
                        isPendingVerifyAuthCode ||
                        isVerifyAuthCode
                      }
                    />
                  </View>
                </View>
              </View>
              {isVerifyAuthCode && stores && stores.length > 0 && (
                <View>
                  <InputLabel label="매장 선택" />
                  <Picker
                    items={stores.map((store) => ({
                      label: store.name,
                      value: store.storeId,
                    }))}
                    selectedItem={selectedStoreId}
                    setSelectedItem={setSelectedStoreId}
                  />
                </View>
              )}
            </View>
            <Button
              label="다음"
              onPress={() =>
                router.push({
                  pathname: "/device/registration-step2",
                  params: {
                    accountId: profile?.accountId,
                    storeId: selectedStoreId,
                    phoneNumber: unformattedPhone,
                  },
                })
              }
              disabled={
                !isValidForm ||
                !isVerifyAuthCode ||
                !Boolean(profile?.accountId) ||
                !Boolean(selectedStoreId)
              }
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
    marginBottom: 48,
  },
  headerText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    fontSize: 24,
    fontWeight: "600",
  },
  sectionContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWithButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: 90,
    height: 40,
  },
});

export default RegistrationStep1Screen;
