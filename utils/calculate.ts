import { Order } from "@/types/order";

export const calculateService = (amount: number, serviceRate: number) => {
  let result = 0;
  if (serviceRate > 0) {
    const p = 1 + serviceRate / 100.0;
    const r = amount / p;
    result = amount - Math.round(r);
  }
  return result;
};

export const calculateVat = (amount: number, service: number, vatRate: number) => {
  let result = 0;
  if (vatRate > 0) {
    const p = 1 + vatRate / 100.0;
    const r = (amount - service) / p;
    result = amount - service - Math.round(r);
  }
  return result;
};

export const calculateOrdersTotalPrice = (orders: Order[]) => {
  let totalPrice = 0;
  for (const order of orders) {
    totalPrice += calculateOrderTotalPrice(order);
  }
  return totalPrice;
};

export const calculateOrderTotalPrice = (order: Order) => {
  return order.orderMenus.reduce((acc, menu) => {
    const optionPrice = menu.orderOptionGroups
      .flatMap((group) => group.orderOptions)
      .reduce((acc, option) => acc + option.price, 0);
    return acc + (menu.price + optionPrice) * menu.quantity;
  }, 0);
};
