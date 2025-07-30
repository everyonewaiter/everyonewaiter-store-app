import { CashReceiptType, PaymentMethod } from '@/constants'

export type CreatePaymentRequest = {
  tableNo: number
  method: keyof typeof PaymentMethod
  amount: number
  approvalNo: string
  installment: string
  cardNo: string
  issuerName: string
  purchaseName: string
  merchantNo: string
  tradeTime: string
  tradeUniqueNo: string
  vat: number
  supplyAmount: number
  cashReceiptNo: string
  cashReceiptType: keyof typeof CashReceiptType
}

export type CreateCardPaymentRequest = Omit<
  CreatePaymentRequest,
  'method' | 'cashReceiptNo' | 'cashReceiptType'
>
