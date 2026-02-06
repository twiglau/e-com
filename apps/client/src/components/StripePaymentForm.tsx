"use client";

import React from "react";
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import type { CartItemsType, ShippingFormInputs } from "@repo/types";
import { loadStripe } from "@stripe/stripe-js";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@clerk/nextjs";
import CheckoutForm from "./CheckoutForm";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const fetchClientSecret = async (cart: CartItemsType, token: string) => {
    return fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ cart }),
        }
    )
}
export const StripePaymentForm = ({
    shippingForm
}: {
    shippingForm: ShippingFormInputs
}) => {
    const { cart } = useCartStore();
    const [token, setToken] = React.useState<string | null>(null);
    const { getToken } = useAuth();

    React.useEffect(() => {
        getToken({template: 'long-lived'}).then((token) => setToken(token));
    }, [getToken]);

    const options = React.useMemo(() => {
        if (!token) return null;
        return {
            clientSecret: fetchClientSecret(cart, token)
                .then(async (res) => {
                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.error || "Failed to fetch client secret");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (!data.clientSecret) {
                        throw new Error("Client secret missing in server response");
                    }
                    return data.clientSecret;
                }),
        };
    }, [cart, token]);

    if (!token || !options) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <CheckoutProvider stripe={stripe} options={options}>
            <CheckoutForm shippingForm={shippingForm} />
        </CheckoutProvider>
    );
}