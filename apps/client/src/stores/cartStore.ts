import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CartStoreActionsType,
  CartStoreStateType,
  CartItemType,
} from "../types";

export const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,
      addToCart: (cartItem: CartItemType) => {
        set((state) => {
          const index = state.cart.findIndex(
            (item) =>
              item.id === cartItem.id &&
              item.size == cartItem.size &&
              item.color == cartItem.color,
          );
          if (index !== -1) {
            const updateCart = [...state.cart];
            updateCart[index]!.quantity += cartItem.quantity || 1;
            return {
              cart: updateCart,
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...cartItem,
                quantity: cartItem.quantity || 1,
                size: cartItem.size,
                color: cartItem.color,
              },
            ],
          };
        });
      },
      removeFromCart: (id: string | number) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },
      clearCart: () => {
        set({
          cart: [],
        });
      },
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
