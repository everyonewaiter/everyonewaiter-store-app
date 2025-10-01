import { KitchenPrinterLocation, StoreStatus } from "@/constants";

export type StoreName = {
  storeId: string;
  name: string;
};

export type Store = {
  storeId: string;
  accountId: string;
  name: string;
  ceoName: string;
  address: string;
  landline: string;
  license: string;
  image: string;
  status: keyof typeof StoreStatus;
  lastOpenedAt: string;
  lastClosedAt: string;
  setting: Setting;
  createdAt: string;
  updatedAt: string;
};

export type Setting = {
  ksnetDeviceNo: string;
  extraTableCount: number;
  kitchenPrinterLocation: keyof typeof KitchenPrinterLocation;
  showMenuPopup: boolean;
  showOrderTotalPrice: boolean;
  showOrderMenuImage: boolean;
  countryOfOrigins: CountryOfOrigin[];
  staffCallOptions: string[];
};

export type CountryOfOrigin = {
  item: string;
  origin: string;
};
