package expo.modules.kscat

import android.os.Bundle

class KscatResponse(receiveData: ByteArray) {

    val dataLength = ByteArray(4)
    val transactionCode = ByteArray(2)
    val operationCode = ByteArray(2)
    val transferCode = ByteArray(4)
    val transferType = ByteArray(1)
    val deviceNo = ByteArray(10)
    val companyInfo = ByteArray(4)
    val transferSerialNo = ByteArray(12)
    val status = ByteArray(1)
    val standardCode = ByteArray(4)
    val cardCompanyCode = ByteArray(4)
    val transferDate = ByteArray(12)
    val cardType = ByteArray(1)
    val message1 = ByteArray(16)
    val message2 = ByteArray(16)
    val approvalNo = ByteArray(12)
    val transactionUniqueNo = ByteArray(20)
    val merchantNo = ByteArray(15)
    val issuanceCode = ByteArray(2)
    val cardCategoryName = ByteArray(16)
    val purchaseCompanyCode = ByteArray(2)
    val purchaseCompanyName = ByteArray(16)
    val workingKeyIndex = ByteArray(2)
    val workingKey = ByteArray(16)
    val balance = ByteArray(9)
    val point1 = ByteArray(9)
    val point2 = ByteArray(9)
    val point3 = ByteArray(9)
    val notice1 = ByteArray(20)
    val notice2 = ByteArray(40)
    val reserved = ByteArray(5)
    val ksnetReserved = ByteArray(40)
    val filler = ByteArray(30)
    val extraData = ByteArray(650)
    var hasExtraData = false

    init {
        var index = 1
        System.arraycopy(receiveData, 0, dataLength, 0, 4)
        index += 4
        System.arraycopy(receiveData, index, transactionCode, 0, 2)
        index += 2
        System.arraycopy(receiveData, index, operationCode, 0, 2)
        index += 2
        System.arraycopy(receiveData, index, transferCode, 0, 4)
        index += 4
        System.arraycopy(receiveData, index, transferType, 0, 1)
        index += 1
        System.arraycopy(receiveData, index, deviceNo, 0, 10)
        index += 10
        System.arraycopy(receiveData, index, companyInfo, 0, 4)
        index += 4
        System.arraycopy(receiveData, index, transferSerialNo, 0, 12)
        index += 12
        System.arraycopy(receiveData, index, status, 0, 1)
        index += 1
        System.arraycopy(receiveData, index, standardCode, 0, 4)
        index += 4
        System.arraycopy(receiveData, index, cardCompanyCode, 0, 4)
        index += 4
        System.arraycopy(receiveData, index, transferDate, 0, 12)
        index += 12
        System.arraycopy(receiveData, index, cardType, 0, 1)
        index += 1
        System.arraycopy(receiveData, index, message1, 0, 16)
        index += 16
        System.arraycopy(receiveData, index, message2, 0, 16)
        index += 16
        System.arraycopy(receiveData, index, approvalNo, 0, 12)
        index += 12
        System.arraycopy(receiveData, index, transactionUniqueNo, 0, 20)
        index += 20
        System.arraycopy(receiveData, index, merchantNo, 0, 15)
        index += 15
        System.arraycopy(receiveData, index, issuanceCode, 0, 2) // 발급사 코드
        index += 2
        System.arraycopy(receiveData, index, cardCategoryName, 0, 16) // 카드종류 명
        index += 16
        System.arraycopy(receiveData, index, purchaseCompanyCode, 0, 2) // 매입사 코드
        index += 2
        System.arraycopy(receiveData, index, purchaseCompanyName, 0, 16) // 매입사 명
        index += 16
        System.arraycopy(receiveData, index, workingKeyIndex, 0, 2)
        index += 2
        System.arraycopy(receiveData, index, workingKey, 0, 16)
        index += 16
        System.arraycopy(receiveData, index, balance, 0, 9)
        index += 9
        System.arraycopy(receiveData, index, point1, 0, 9)
        index += 9
        System.arraycopy(receiveData, index, point2, 0, 9)
        index += 9
        System.arraycopy(receiveData, index, point3, 0, 9)
        index += 9
        System.arraycopy(receiveData, index, notice1, 0, 20)
        index += 20
        System.arraycopy(receiveData, index, notice2, 0, 40)
        index += 40
        System.arraycopy(receiveData, index, reserved, 0, 5)
        index += 5
        System.arraycopy(receiveData, index, ksnetReserved, 0, 40)
        index += 40
        System.arraycopy(receiveData, index, filler, 0, 30)
        index += 30
        if (receiveData.size > 458) {
            hasExtraData = true
            System.arraycopy(receiveData, index, extraData, 0, receiveData.size - index)
        }
    }

    fun bundle() = Bundle().apply {
        putString("dataLength", dataLength.toEucKrString())
        putString("transactionCode", transactionCode.toEucKrString())
        putString("operationCode", operationCode.toEucKrString())
        putString("transferCode", transferCode.toEucKrString())
        putString("transferType", transferType.toEucKrString())
        putString("deviceNo", deviceNo.toEucKrString())
        putString("companyInfo", companyInfo.toEucKrString())
        putString("transferSerialNo", transferSerialNo.toEucKrString())
        putString("status", status.toEucKrString())
        putString("standardCode", standardCode.toEucKrString())
        putString("cardCompanyCode", cardCompanyCode.toEucKrString())
        putString("transferDate", transferDate.toEucKrString())
        putString("cardType", cardType.toEucKrString())
        putString("message1", message1.toEucKrString())
        putString("message2", message2.toEucKrString())
        putString("approvalNo", approvalNo.toEucKrString())
        putString("transactionUniqueNo", transactionUniqueNo.toEucKrString())
        putString("merchantNo", merchantNo.toEucKrString())
        putString("issuanceCode", issuanceCode.toEucKrString())
        putString("cardCategoryName", cardCategoryName.toEucKrString())
        putString("purchaseCompanyCode", purchaseCompanyCode.toEucKrString())
        putString("purchaseCompanyName", purchaseCompanyName.toEucKrString())
        putString("workingKeyIndex", workingKeyIndex.toEucKrString())
        putString("workingKey", workingKey.toEucKrString())
        putString("balance", balance.toEucKrString())
        putString("point1", point1.toEucKrString())
        putString("point2", point2.toEucKrString())
        putString("point3", point3.toEucKrString())
        putString("notice1", notice1.toEucKrString())
        putString("notice2", notice2.toEucKrString())
        putString("reserved", reserved.toEucKrString())
        putString("ksnetReserved", ksnetReserved.toEucKrString())
        putString("filler", filler.toEucKrString())
        if (hasExtraData) {
            putString("extraData", extraData.toEucKrString())
        }
        putString("hasExtraData", hasExtraData.toString())
    }
}
