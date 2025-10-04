import { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { AdultIcon, BabyIcon } from "@/assets/icons";
import Button from "@/components/Button";
import LogoHeaderTitle from "@/components/LogoHeaderTitle";
import ErrorModal from "@/components/Modal/ErrorModal";
import SubmitModal from "@/components/Modal/SubmitModal";
import SuccessModal from "@/components/Modal/SuccessModal";
import NumPad from "@/components/NumPad";
import PersonCountBox from "@/components/PersonCountBox";
import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { milliTimes } from "@/constants/times";
import useIdle from "@/hooks/useIdle";
import useModals from "@/hooks/useModal";
import { useCreateWaiting, useGetWaitingCount } from "@/hooks/useWaitingApi";
import useWaitingForm, { WaitingFormName } from "@/hooks/useWaitingForm";
import { ModalName } from "@/stores/modal";
import { formatPhoneNumberWithoutPrefix } from "@/utils/format";
import { parseErrorMessage } from "@/utils/support";

const PHONE_NUMBER_PREFIX = "010";

const WaitingRegistrationScreen = () => {
  const { idleTime, resetIdleTime, gesture } = useIdle(milliTimes.ONE_MINUTE);

  const { form, handleOnChange, isEmptyForm, isValidForm, resetAllState } = useWaitingForm();
  const formattedPhone = formatPhoneNumberWithoutPrefix(form[WaitingFormName.PHONE_NUMBER]);

  const { waitingCount } = useGetWaitingCount();
  const { mutate, isPending } = useCreateWaiting();

  const { openModal, closeModal, closeAllModals } = useModals();

  const resetAll = useCallback(() => {
    closeAllModals();
    resetAllState();
    resetIdleTime();
  }, [closeAllModals, resetAllState, resetIdleTime]);

  useEffect(() => {
    if (idleTime <= milliTimes.ZERO && !isEmptyForm) {
      resetAll();
    }
  }, [idleTime, isEmptyForm, resetAll]);

  const addNumToPhone = (num: number) => {
    const added = form[WaitingFormName.PHONE_NUMBER] + num;
    handleOnChange[WaitingFormName.PHONE_NUMBER](added);
  };

  const removeLastNumToPhone = () => {
    const removed = form[WaitingFormName.PHONE_NUMBER].slice(0, -1);
    handleOnChange[WaitingFormName.PHONE_NUMBER](removed);
  };

  const openSubmitModal = () => {
    openModal(ModalName.WAITING_REGISTRATION_SUBMIT, SubmitModal, {
      title: `${PHONE_NUMBER_PREFIX} - ${formattedPhone}`,
      message: "위 번호로 웨이팅 등록을 하시겠습니까?",
      submitButtonLabel: "등록하기",
      onSubmit: () => {
        closeModal();
        submitCreateWaiting();
      },
      onClose: closeModal,
      disabled: !isValidForm || isPending,
    });
  };

  const submitCreateWaiting = () => {
    mutate(
      {
        phoneNumber: `${PHONE_NUMBER_PREFIX}${form[WaitingFormName.PHONE_NUMBER]}`,
        adult: form[WaitingFormName.ADULT],
        infant: form[WaitingFormName.INFANT],
      },
      {
        onSuccess: () => {
          openModal(ModalName.WAITING_REGISTRATION_SUCCESS, SuccessModal, {
            title: "웨이팅 등록 완료",
            message: "휴대폰 번호로 전송된 알림톡 또는 문자 메시지를 확인해 주세요.",
            onClose: resetAll,
          });
        },
        onError: (error) => {
          openModal(ModalName.WAITING_REGISTRATION_ERROR, ErrorModal, {
            title: "웨이팅 등록 실패",
            message: parseErrorMessage(error),
            onClose: resetAll,
          });
        },
      }
    );
  };

  return (
    <GestureDetector gesture={gesture}>
      <SafeAreaView style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoTextContainer}>
              <LogoHeaderTitle />
              <View>
                <Text style={styles.mainText}>현재 대기 중인 팀은</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={[styles.mainText, styles.highlightMainText]}>{waitingCount}팀</Text>
                  <Text style={styles.mainText}> 입니다.</Text>
                </View>
              </View>
              <View>
                {waitingCount > 0 ? (
                  <Text style={styles.subText}>
                    자리가 준비되면 연락드릴게요!{"\n"}
                    인원과 전화번호를 입력해 주세요.
                  </Text>
                ) : (
                  <Text style={styles.subText}>
                    현재 대기 중인 팀이 없습니다.{"\n"}
                    지금 바로 매장에 입장해 주세요!
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.personContainer}>
              <View style={styles.personCountContainer}>
                <PersonCountBox
                  icon={<AdultIcon />}
                  label="성인"
                  count={form[WaitingFormName.ADULT]}
                  minusHandler={() => handleOnChange[WaitingFormName.ADULT]("decrease")}
                  plusHandler={() => handleOnChange[WaitingFormName.ADULT]("increase")}
                />
                <PersonCountBox
                  icon={<BabyIcon />}
                  label="유아"
                  count={form[WaitingFormName.INFANT]}
                  minusHandler={() => handleOnChange[WaitingFormName.INFANT]("decrease")}
                  plusHandler={() => handleOnChange[WaitingFormName.INFANT]("increase")}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.numPadContainer}>
          <View style={styles.numPadContent}>
            <View style={styles.phoneNumberContainer}>
              <Text style={styles.phoneNumberText}>
                {`${PHONE_NUMBER_PREFIX} - ${formattedPhone}`}
              </Text>
              <Text style={styles.phoneNumberSubText}>
                실시간 웨이팅 안내를 받을 수 있는 번호를 입력해 주세요.
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <View style={styles.numPad}>
                <NumPad
                  label={1}
                  positionX="left"
                  positionY="top"
                  onPress={() => addNumToPhone(1)}
                />
                <NumPad
                  label={2}
                  positionX="center"
                  positionY="top"
                  onPress={() => addNumToPhone(2)}
                />
                <NumPad
                  label={3}
                  positionX="right"
                  positionY="top"
                  onPress={() => addNumToPhone(3)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad
                  label={4}
                  positionX="left"
                  positionY="center"
                  onPress={() => addNumToPhone(4)}
                />
                <NumPad
                  label={5}
                  positionX="center"
                  positionY="center"
                  onPress={() => addNumToPhone(5)}
                />
                <NumPad
                  label={6}
                  positionX="right"
                  positionY="center"
                  onPress={() => addNumToPhone(6)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad
                  label={7}
                  positionX="left"
                  positionY="center"
                  onPress={() => addNumToPhone(7)}
                />
                <NumPad
                  label={8}
                  positionX="center"
                  positionY="center"
                  onPress={() => addNumToPhone(8)}
                />
                <NumPad
                  label={9}
                  positionX="right"
                  positionY="center"
                  onPress={() => addNumToPhone(9)}
                />
              </View>
              <View style={styles.numPad}>
                <NumPad label="reset" positionX="left" positionY="bottom" onPress={resetAll} />
                <NumPad
                  label={0}
                  positionX="center"
                  positionY="bottom"
                  onPress={() => addNumToPhone(0)}
                />
                <NumPad
                  label="back"
                  positionX="right"
                  positionY="bottom"
                  onPress={removeLastNumToPhone}
                />
              </View>
            </View>
            <View style={{ flex: 0.5, justifyContent: "flex-end" }}>
              <Button
                label="등록하기"
                color="black"
                onPress={openSubmitModal}
                disabled={!isValidForm}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 32,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  viewContainer: {
    flex: 1,
  },
  numPadContainer: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  infoTextContainer: {
    gap: 32,
  },
  mainText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 60,
  },
  highlightMainText: {
    color: colors.PRIMARY_RED,
    borderBottomWidth: 3,
    borderBottomColor: colors.PRIMARY_RED,
  },
  subText: {
    fontFamily: fonts.PRETENDARD_MEDIUM,
    color: colors.GRAY2_55,
    fontSize: 24,
  },
  personContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  personCountContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    padding: 32,
  },
  numPadContent: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: colors.WHITE,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  phoneNumberContainer: {
    flex: 0.5,
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  phoneNumberText: {
    fontFamily: fonts.PRETENDARD_BOLD,
    fontSize: 40,
  },
  phoneNumberSubText: {
    fontFamily: fonts.PRETENDARD_REGULAR,
    fontSize: 24,
    color: colors.GRAY3_99,
  },
  numPad: {
    height: "25%",
    flexDirection: "row",
  },
});

export default WaitingRegistrationScreen;
