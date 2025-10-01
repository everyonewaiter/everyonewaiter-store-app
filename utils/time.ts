import { milliTimes } from "@/constants/times";

export const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / milliTimes.ONE_MINUTE);
  const seconds = Math.floor((milliseconds % milliTimes.ONE_MINUTE) / milliTimes.ONE_SECOND);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
