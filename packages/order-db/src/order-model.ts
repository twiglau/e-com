import mongoose from "mongoose";

export const OrderStatus = ["success", "failed"] as const;

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: String, required: true },
    status: { type: String, required: true, enum: OrderStatus },
    products: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: String, required: true },
          quantity: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export type OrderSchemaType = mongoose.InferSchemaType<typeof OrderSchema>;

export const OrderModel = mongoose.model<OrderSchemaType>("Order", OrderSchema);
