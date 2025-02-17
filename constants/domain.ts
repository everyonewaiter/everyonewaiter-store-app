export const AuthenticationPurpose = {
  SIGN_UP: '회원가입',
  DEVICE_REGISTRATION: '기기인증',
} as const

export const DevicePurpose = {
  TABLE: '손님 테이블',
  WAITING: '웨이팅 등록',
  HALL: '홀 관리',
  POS: 'POS',
} as const

export const DeviceStatus = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
} as const
