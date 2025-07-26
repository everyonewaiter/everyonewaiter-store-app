package expo.modules.utility

import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class UtilityModule : Module() {
    private val currentActivity get() = appContext.throwingActivity

    override fun definition() = ModuleDefinition {
        Name("Utility")

        Function("hideNavigationBar") {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                currentActivity.runOnUiThread {
                    currentActivity.window.setDecorFitsSystemWindows(false)
                    currentActivity.window.insetsController?.let {
                        it.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                        it.systemBarsBehavior =
                            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                    }
                }
            } else {
                currentActivity.runOnUiThread {
                    @Suppress("DEPRECATION")
                    currentActivity.window.decorView.systemUiVisibility = (
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                            )
                }
            }
        }
    }
}
