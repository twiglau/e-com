import z from "zod";

export type ProductType = {
  id: string | number;
  name: string;
  price: number;
  images: Record<string, string>;
  colors: string[];
  sizes: string[];
  shortDescription: string;
  description: string;
};

export type ProductsType = ProductType[];

export type CartItemType = ProductType & {
  quantity: number;
  size: string;
  color: string;
};

export type CartStoreStateType = {
  cart: CartItemType[];
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (cart: CartItemType) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
};

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(7, "Phone must be between 7 and 10 digits!")
    .max(10, "Phone must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone must contain only numbers!"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
});

export type ShippingFormInputsType = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder is required"),
  cardNumber: z
    .string()
    .min(16, "Card number is required")
    .max(16, "Card number is required"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Expiration date must be in MM/YY format!",
    ),
  cvv: z
    .string()
    .min(3, "CVV must be 3 digits!")
    .max(3, "CVV must be 3 digits!"),
});

export type PaymentFormInputsType = z.infer<typeof paymentFormSchema>;
