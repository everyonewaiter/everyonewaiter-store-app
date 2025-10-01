import { DevicePurpose } from "@/constants/domain";

const phoneNumberRegex = /^01[016789]\d{7,8}$/;
const authenticationCodeRegex = /^\d{6}$/;

export const validatePhoneNumber = (phoneNumber: string) => {
  if (phoneNumberRegex.test(phoneNumber)) {
    return "";
  }
  return "유효하지 않은 휴대폰 번호 형식입니다.";
};

export const validateAuthCode = (authCode: string) => {
  if (authenticationCodeRegex.test(authCode)) {
    return "";
  }
  return "인증번호는 6자리의 숫자입니다.";
};

const validateTableNo = (tableNo: string) => {
  const parsedTableNo = parseInt(tableNo, 10);

  if (isNaN(parsedTableNo)) {
    return "테이블 번호는 숫자만 입력 가능합니다.";
  }
  if (parsedTableNo.toString() !== tableNo) {
    return "테이블 번호는 정수만 입력 가능합니다.";
  }
  if (Number(tableNo) < 1) {
    return "테이블 번호는 1 이상이어야 합니다.";
  }

  return "";
};

const validateDeviceName = (name: string) => {
  if (name.length === 0) {
    return "기기 이름을 입력해주세요.";
  }
  if (name.length > 20) {
    return "기기 이름은 20자 이하로 입력해주세요.";
  }
  return "";
};

export const validateCreateDevice = (
  purpose: keyof typeof DevicePurpose,
  name: string,
  tableNo: string
) => {
  const error = { name: "", tableNo: "" };

  error.name = validateDeviceName(name);
  if (purpose === "TABLE") {
    error.tableNo = validateTableNo(tableNo);
  }

  const hasError = Object.values(error).some((value) => value.length > 0);
  return { hasError, error };
};
