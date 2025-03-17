export const AuthenticationPurpose = {
  SIGN_UP: '회원가입',
  DEVICE_REGISTRATION: '기기인증',
} as const

export const DevicePurpose = {
  TABLE: '손님 테이블',
  WAITING: '웨이팅 등록',
} as const

export const DeviceStatus = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
} as const

export const KitchenPrinterLocation = {
  POS: 'POS',
  HALL: '홀 관리',
} as const

export const MenuLabel = {
  DEFAULT: '기본',
  NEW: 'NEW',
  BEST: 'BEST',
  RECOMMEND: '추천',
} as const

export const MenuOptionGroupType = {
  MANDATORY: '필수',
  CHOICE: '선택',
} as const

export const MenuStatus = {
  DEFAULT: '기본',
  HIDE: '숨김',
  SOLD_OUT: '품절',
} as const

export const PaymentType = {
  PREPAID: '선결제',
  POSTPAID: '후결제',
} as const

export const StoreStatus = {
  OPEN: '영업중',
  CLOSE: '영업 마감',
} as const

export const UserRole = {
  USER: '사용자',
  OWNER: '사장님',
  ADMIN: '관리자',
} as const
