package expo.modules.kscat

import java.nio.ByteBuffer

class Telegram private constructor(
    val code: String,
    val deviceNo: String,
    val installment: String,
    val amount: Long,
    val approveNo: String = "            ",
    val approveDate: String = "      ",
) {
    fun makeIC(): ByteArray {
        val buffer = ByteBuffer.allocate(4096)
        buffer.put(0x02.toByte()) // STX
        buffer.put("IC".toByteArray()) // 거래구분
        buffer.put("01".toByteArray()) // 업무구분
        if (code == "0") {
            buffer.put("0420".toByteArray()) // IC 취소
        } else {
            buffer.put("0200".toByteArray()) // IC 승인
        }
        buffer.put("N".toByteArray()) // 거래형태
        buffer.put(deviceNo.toByteArray()) // 단말기번호
        repeat(4) { buffer.put(" ".toByteArray()) } // 업체정보
        repeat(12) { buffer.put(" ".toByteArray()) } // 전문일련번호
        buffer.put("S".toByteArray()) // POS Entry Mode IC
        repeat(20) { buffer.put(" ".toByteArray()) } // 거래 고유 번호
        repeat(20) { buffer.put(" ".toByteArray()) } // 암호화하지 않은 카드번호
        buffer.put("9".toByteArray()) // 암호화여부
        buffer.put("################".toByteArray())
        buffer.put("################".toByteArray())
        repeat(40) { buffer.put(" ".toByteArray()) } // 암호화 정보
        repeat(37) { buffer.put(" ".toByteArray()) } // Track II - IC
        buffer.put(0x1C.toByte()) // FS
        buffer.put(installment.toByteArray()) // 할부개월

        val tax = Tax.calculateTax(amount, 10.0, 0.0)
        buffer.put(tax.amount.toString().fillZero(12).toByteArray()) // 총금액
        buffer.put(tax.service.toString().fillZero(12).toByteArray()) // 봉사료
        buffer.put(tax.vat.toString().fillZero(12).toByteArray()) // 부가세
        buffer.put(tax.supply.toString().fillZero(12).toByteArray()) // 공급금액

        buffer.put("000000000000".toByteArray()) // 면세금액
        buffer.put("AA".toByteArray()) // Working Key Index
        repeat(16) { buffer.put("0".toByteArray()) } // 비밀번호
        buffer.put(approveNo.toByteArray()) // 원거래승인번호
        buffer.put(approveDate.toByteArray()) // 원거래승인일자
        repeat(163) { buffer.put(" ".toByteArray()) } // 사용자정보 ~ DCC 환율조회 data
        buffer.put("N".toByteArray()) // 전자서명 유무
        buffer.put(0x03.toByte()) // ETX
        buffer.put(0x0D.toByte()) // CR

        val telegram = ByteArray(buffer.position())
        buffer.rewind()
        buffer.get(telegram)
        val requestTelegram = ByteArray(telegram.size + 4)
        val telegramLength = telegram.size.toString().fillZero(4)
        System.arraycopy(telegramLength.toByteArray(), 0, requestTelegram, 0, 4)
        System.arraycopy(telegram, 0, requestTelegram, 4, telegram.size)
        return requestTelegram
    }

    companion object {
        fun approve(
            deviceNo: String,
            installment: String,
            amount: Long,
        ) = Telegram("1", deviceNo, installment, amount)

        fun cancel(
            deviceNo: String,
            installment: String,
            amount: Long,
            approveNo: String,
            approveDate: String,
        ) = Telegram("0", deviceNo, installment, amount, approveNo, approveDate)
    }
}
