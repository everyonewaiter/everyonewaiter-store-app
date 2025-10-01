import { NativeModule, requireNativeModule } from "expo";

import { KscatResponse } from "@/modules/kscat";

declare class KscatModule extends NativeModule {
  approveIC(deviceNo: string, installment: string, amount: number): Promise<KscatResponse>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<KscatModule>("Kscat");
