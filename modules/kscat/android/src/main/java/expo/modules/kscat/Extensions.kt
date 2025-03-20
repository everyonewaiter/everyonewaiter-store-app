package expo.modules.kscat

import java.nio.charset.Charset

fun String.fillZero(length: Int): String {
    return this.padStart(length, '0')
}

fun ByteArray.toEucKrString(): String {
    return this.toString(Charset.forName("euc-kr"))
}
