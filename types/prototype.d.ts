declare global {
  interface Number {
    toPrice: () => string;
  }
}

export {};
