const phoneNumberRegex = /^01[016789]\d{7,8}$/
const authenticationCodeRegex = /^\d{6}$/

export const validatePhoneNumber = (phoneNumber: string) => {
  if (phoneNumberRegex.test(phoneNumber)) {
    return ''
  }
  return '유효하지 않은 휴대폰 번호 형식입니다.'
}

export const validateAuthCode = (authCode: string) => {
  if (authenticationCodeRegex.test(authCode)) {
    return ''
  }
  return '인증번호는 6자리의 숫자입니다.'
}
