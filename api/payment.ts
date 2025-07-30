import { axiosInstance } from '@/api/axios'
import { CreateCardPaymentRequest } from '@/types'
import { makeSignatureHeader } from '@/utils'

export const createCardPayment = async ({
  tableNo,
  ...requestBody
}: CreateCardPaymentRequest) => {
  const requestMethod = 'POST'
  const requestURI = `/v1/orders/payments/${tableNo}/approve`
  const headers = await makeSignatureHeader(requestMethod, requestURI)
  return await axiosInstance.post(
    requestURI,
    {
      ...requestBody,
      method: 'CARD',
      cashReceiptNo: '',
      cashReceiptType: 'NONE',
    },
    {
      headers,
    },
  )
}
