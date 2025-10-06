export const CashReceiptType = {
  NONE: "미발행",
  DEDUCTION: "소득공제",
  PROOF: "지출증빙",
} as const;

export const SupportPurpose = {
  TABLE: "손님 테이블",
  WAITING: "웨이팅 등록",
} as const;

export const DevicePurpose = {
  TABLE: "손님 테이블",
  WAITING: "웨이팅 등록",
  HALL: "홀 관리",
  POS: "POS",
} as const;

export const DeviceState = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
} as const;

export const KitchenPrinterLocation = {
  POS: "POS",
  HALL: "홀 관리",
} as const;

export const MenuLabel = {
  DEFAULT: "기본",
  NEW: "NEW",
  BEST: "BEST",
  RECOMMEND: "추천",
} as const;

export const MenuOptionGroupType = {
  MANDATORY: "필수",
  OPTIONAL: "선택",
} as const;

export const MenuState = {
  DEFAULT: "기본",
  HIDE: "숨김",
  SOLD_OUT: "품절",
} as const;

export const OrderCategory = {
  INITIAL: "주문",
  ADDITIONAL: "추가",
} as const;

export const OrderState = {
  ORDER: "주문",
  CANCEL: "취소",
} as const;

export const PaymentMethod = {
  CARD: "카드",
  CASH: "현금",
} as const;

export const PaymentType = {
  PREPAID: "선결제",
  POSTPAID: "후결제",
} as const;

export const StoreStatus = {
  OPEN: "영업중",
  CLOSE: "영업 마감",
} as const;

export const AccountPermission = {
  USER: "사용자",
  OWNER: "사장님",
  ADMIN: "관리자",
} as const;
