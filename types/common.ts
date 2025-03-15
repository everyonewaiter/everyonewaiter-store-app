export type valueOf<T> = T[keyof T]

export type StoreActionEvent = {
  category: valueOf<StoreActionCategory>
  actionType: valueOf<StoreActionType>
  hasResource: boolean
  resourceName: string
  resource: string
}

export type StoreActionCategory = {
  DEVICE: '기기'
  STORE: '매장'
  SETTING: '설정'
  CATEGORY: '카테고리'
  MENU: '메뉴'
  WAITING: '웨이팅'
  ORDER: '주문'
  STAFF_CALL: '직원 호출'
  RECEIPT: '레시피'
  POS: 'POS'
}

export type StoreActionType = {
  CREATE: '생성'
  UPDATE: '수정'
  DELETE: '삭제'
}
