import { OrderCategory, OrderState, PaymentType } from "@/constants";

export type CreateStaffCallRequest = {
  optionName: string;
};

export type CreateTableOrderRequest = {
  tableNo: number;
  memo: string;
  orderMenus: OrderCreate[];
};

export type OrderCreate = {
  menuId: string;
  quantity: number;
  menuOptionGroups: OrderCreateOptionGroup[];
};

export type OrderCreateOptionGroup = {
  menuOptionGroupId: string;
  orderOptions: OrderCreateOption[];
};

export type OrderCreateOption = {
  name: string;
  price: number;
};

export type Order = {
  orderId: string;
  storeId: string;
  category: keyof typeof OrderCategory;
  type: keyof typeof PaymentType;
  state: keyof typeof OrderState;
  price: number;
  memo: string;
  served: boolean;
  servedTime: string;
  orderMenus: OrderMenu[];
  createdAt: string;
  updatedAt: string;
};

export type OrderMenu = {
  orderMenuId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  served: boolean;
  servedTime: string;
  printEnabled: boolean;
  orderOptionGroups: OrderOptionGroup[];
};

export type OrderOptionGroup = {
  orderOptionGroupId: string;
  name: string;
  printEnabled: boolean;
  orderOptions: OrderOption[];
};

export type OrderOption = {
  name: string;
  price: number;
};
