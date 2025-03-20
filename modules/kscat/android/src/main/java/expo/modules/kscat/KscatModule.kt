package expo.modules.kscat

import android.app.Activity
import android.content.ComponentName
import android.content.Intent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.toCodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KscatModule : Module() {
    private var pendingPromise: Promise? = null

    override fun definition() = ModuleDefinition {
        Name("Kscat")

        AsyncFunction("approveIC") { deviceNo: String, installment: String, amount: Long, promise: Promise ->
            val telegram = Telegram.approve(deviceNo, installment, amount).makeIC()
            val intent = Intent(Intent.ACTION_MAIN).apply {
                flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
                addCategory(Intent.CATEGORY_LAUNCHER)
                component =
                    ComponentName("com.ksnet.kscat_a", "com.ksnet.kscat_a.PaymentIntentActivity")
                putExtra("Telegram", telegram)
                putExtra("TelegramLength", telegram.size)
            }

            try {
                appContext.throwingActivity.startActivityForResult(intent, 0)
                pendingPromise = promise
            } catch (exception: Throwable) {
                promise.reject(exception.toCodedException())
            }
        }

        OnActivityResult { _, payload ->
            val resultCode = payload.resultCode
            val data = payload.data
            when (resultCode) {
                Activity.RESULT_OK -> {
                    val receiveData = data?.getByteArrayExtra("responseTelegram")
                    val response = KscatResponse(receiveData!!).bundle()
                    pendingPromise?.resolve(response)
                }

                Activity.RESULT_CANCELED -> {
                    val receiveData = data?.getByteArrayExtra("responseTelegram")
                    if (receiveData == null) {
                        pendingPromise?.reject("FAIL", "카드 리더기 또는 KSCAT 앱이 실행 중인지 확인해 주세요.", null)
                    } else {
                        val response = KscatResponse(receiveData).bundle()
                        val responseMessage = """
                            ${response.getString("message1")}
                            ${response.getString("message2")}
                            ${response.getString("notice1")}
                            ${response.getString("notice2")}
                        """.trimIndent()
                        pendingPromise?.reject("FAIL", responseMessage, null)
                    }
                }

                else -> {
                    pendingPromise?.reject("ERROR", "결과 응답은 사용자 정의할 수 없습니다.", null)
                }
            }
            pendingPromise = null
        }
    }
}
