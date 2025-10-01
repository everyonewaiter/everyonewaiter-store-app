import { milliTimes } from "@/constants/times";

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{4})(\d{1,4})/, "$1 - $2");
};

// eslint-disable-next-line no-extend-native
Number.prototype.toPrice = function () {
  return `${this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatPriceText = (price: number) => {
  const sign = price < 0 ? "-" : "+";
  return `${sign} ${Math.abs(price).toPrice()}원`;
};

export const formatTime = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / milliTimes.ONE_MINUTE);
  const seconds = Math.floor((milliseconds % milliTimes.ONE_MINUTE) / milliTimes.ONE_SECOND);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
