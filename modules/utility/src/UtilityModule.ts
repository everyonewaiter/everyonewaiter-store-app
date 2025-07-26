import { NativeModule, requireNativeModule } from 'expo'

declare class UtilityModule extends NativeModule {
  hideNavigationBar(): void
}

// This call loads the native module object from the JSI.
export default requireNativeModule<UtilityModule>('Utility')
