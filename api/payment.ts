import { axiosInstance } from '@/api/axios'
import { CashReceiptType, PaymentMethod } from '@/constants'
import { valueOf } from '@/types'
import { makeSignatureHeader } from '@/utils'

type CreatePaymentRequest = {
  tableNo: number
  paymentMethod: valueOf<typeof PaymentMethod>
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
  cashReceiptType: valueOf<typeof CashReceiptType>
}

type CreateCardPaymentRequest = Omit<
  CreatePaymentRequest,
  'paymentMethod' | 'cashReceiptNo' | 'cashReceiptType'
>

export const createCardPayment = async ({
  ...requestBody
}: CreateCardPaymentRequest) => {
  const headers = await makeSignatureHeader()
  return await axiosInstance.post(
    `/orders/payments/approve`,
    {
      ...requestBody,
      paymentMethod: PaymentMethod.CARD,
      cashReceiptNo: '',
      cashReceiptType: CashReceiptType.NONE,
    },
    {
      headers,
    },
  )
}
