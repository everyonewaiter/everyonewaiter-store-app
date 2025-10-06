import { create } from "zustand";

import { OrderCreate } from "@/types/order";

interface CartStore {
  cart: OrderCreate[];
  setCart: (cartItems: OrderCreate[]) => void;
  isEmpty: () => boolean;
  resetCart: () => void;
}

const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  setCart: (cartItems: OrderCreate[]) => set({ cart: [...cartItems] }),
  resetCart: () => set({ cart: [] }),
  isEmpty: () => get().cart.length === 0,
}));

export default useCartStore;
