export type valueOf<T> = T[keyof T]

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type SseEvent = {
  storeId: string
  category: keyof SseCategory
  action: keyof ServerAction
  hasData: boolean
  data: string
}

export type SseCategory = {
  DEVICE: '기기'
  STORE: '매장'
  CATEGORY: '카테고리'
  MENU: '메뉴'
  WAITING: '웨이팅'
  ORDER: '주문'
  STAFF_CALL: '직원 호출'
  RECEIPT: '레시피'
  POS: 'POS'
}

export type ServerAction = {
  GET: '조회'
  CREATE: '생성'
  UPDATE: '수정'
  DELETE: '삭제'
}
