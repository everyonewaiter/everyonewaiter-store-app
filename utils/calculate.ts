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
