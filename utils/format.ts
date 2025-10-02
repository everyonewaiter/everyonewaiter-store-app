import { milliTimes } from "@/constants/times";

const onlyNumberRegex = /\D/g;

export const formatPhoneNumberOnlyNumber = (value: string) => {
  return value.replace(onlyNumberRegex, "");
};

export const formatPhoneNumberWithPrefix = (value: string) => {
  const d = formatPhoneNumberOnlyNumber(value);
  if (!d) return "";

  // 02: 02-4-4
  if (d.startsWith("02")) {
    if (d.length <= 2) return d;
    const head = d.slice(0, 2);
    const rest = d.slice(2, 10);
    if (rest.length <= 4) return `${head}-${rest}`;
    return `${head}-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // 01X: 01X-4-4
  if (d.startsWith("01")) {
    if (d.length <= 3) return d;
    const head = d.slice(0, 3);
    const rest = d.slice(3, 11);
    if (rest.length <= 4) return `${head}-${rest}`;
    return `${head}-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // 0XX: 지역번호 3-3-4
  if (d.startsWith("0")) {
    if (d.length <= 3) return d;
    const head = d.slice(0, 3);
    const rest = d.slice(3, 10);
    if (rest.length <= 3) return `${head}-${rest}`;
    return `${head}-${rest.slice(0, 3)}-${rest.slice(3)}`;
  }

  // 기타: 3-3-4
  if (d.length <= 3) return d;
  const head = d.slice(0, 3);
  const rest = d.slice(3, 10);
  if (rest.length <= 3) return `${head}-${rest}`;
  return `${head}-${rest.slice(0, 3)}-${rest.slice(3)}`;
};

export const formatPhoneNumberWithoutPrefix = (value: string) => {
  return value.replace(/(\d{4})(\d{1,4})/, "$1 - $2");
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
