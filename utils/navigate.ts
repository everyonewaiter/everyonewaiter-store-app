import { Device } from "@/types/device";

export const getNavigatePath = (device: Device) => {
  switch (device.purpose) {
    case "WAITING":
      return "/waiting/registration";
    case "TABLE":
      return "/table/customer";
    case "HALL":
      return "/hall/management";
    case "POS":
      return "/pos/tables";
    default:
      throw new Error("Unknown device purpose");
  }
};

export const getNavigatePathOrNull = (device: Device | null) => {
  if (!device) {
    return null;
  }

  return getNavigatePath(device);
};
