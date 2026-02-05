import { Hono } from "hono";
import { shouldBeUser } from "../middleware/authMiddleware";
import type { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";
import stripe from "../utils/stripe";

const sessionRoute = new Hono();

sessionRoute.post("/create-checkout-session", shouldBeUser, async (c) => {
  const { cart }: { cart: CartItemsType } = await c.req.json();
  const userId = c.get("userId");

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      let unitAmount = await getStripeProductPrice(item.id);

      // Fallback to item price if Stripe price not found
      if (unitAmount === null || unitAmount === undefined) {
        console.warn(
          `Price for product ${item.id} not found in Stripe. Using item price: ${item.price}`,
        );
        unitAmount = Math.round(item.price * 100);
      }

      if (isNaN(unitAmount)) {
        throw new Error(`Invalid price for product: ${item.name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    }),
  );

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: "custom",
      return_url:
        "http://localhost:3002/return?session_id={CHECKOUT_SESSION_ID}",
    });

    // console.log(session);

    return c.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ["line_items"],
    },
  );

  // console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});

export default sessionRoute;
