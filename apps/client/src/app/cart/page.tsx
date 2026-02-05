'use client';

import React from 'react';
import { useCartStore } from "@/stores/cartStore";
import { useSearchParams } from "next/navigation";
import CartItem from "@/components/CartItem";
import ShippingForm from "@/components/ShippingForm";
import PaymentForm from "@/components/PaymentForm";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ShippingFormInputs } from '@repo/types';


import { Suspense } from 'react';


const steps = [
    { id: 1, title: "Shopping Cart" },
    { id: 2, title: "Shipping Address" },
    { id: 3, title: "Payment Method" }
]

const CartPageContent = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const activeStep = parseInt(searchParams.get("step") || "1");
    const { cart, removeFromCart } = useCartStore();

   const [shippingForm, setShippingForm] = React.useState<ShippingFormInputs>();

    return (
        <div className="flex flex-col gap-8 items-center justify-center mt-12">
            {/* TITLE */}
            <h1 className="text-2xl font-medium">Your Shopping Cart</h1>
            {/* STEPS */}
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {steps.map((step) => (
                    <div key={step.id} className={`flex items-center gap-2 border-b-2 pb-4 ${
                        step.id === activeStep ? "border-gray-800" : "border-gray-200"
                    }`}>
                        <div className={`size-6 rounded-full p-4 flex items-center justify-center text-white ${
                            step.id === activeStep ? "bg-gray-800" : "bg-gray-400"
                        }`}>
                            {step.id}
                        </div>
                        <span className={`text-sm font-medium ${step.id === activeStep ? "text-gray-800" : "text-gray-400"}`}>{step.title}</span>
                    </div>
                ))}
            </div>
            {/* STEPS & DETAILS */}
            <div className="w-full flex flex-col lg:flex-row gap-16">
                {/* STEPS */}
                <div className="w-full lg-w-7/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8">
                    {activeStep === 1 && (
                        cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-12">
                                <p className="text-gray-500">Your cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <CartItem key={item.id} item={item} removed={() => removeFromCart(item.id)} />
                            ))
                        )
                    )}
                    {activeStep === 2 && <ShippingForm setShippingForm={setShippingForm} />}
                    {activeStep === 3 && <PaymentForm />}
                </div>
                {/* DETAILS */}
                <div className="w-full lg:w-5/12 shadow-lg border-1 border-gray-100 p-8 rounded-lg flex flex-col gap-8 h-max">
                    <h2 className="text-xl font-medium">Order Summary</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Subtotal</p>
                            <p className="font-medium">
                                ${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Discount(10%)</p>
                            <p className="font-medium">$10.00</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Shipping Fee</p>
                            <p className="font-medium">$5.00</p>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-500">Total</p>
                            <p className="font-medium">${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
                        </div>
                    </div>
                    {activeStep === 1 && (
                        <button className="
                            w-full bg-gray-700 hover:bg-gray-900 transition-all duration-300
                            text-white p-2 rounded-lg flex items-center justify-center gap-2
                            cursor-pointer
                        "
                        onClick={() => router.push("/cart?step=2")}
                        >
                            Continue
                            <ArrowRight className="size-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

const CartPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CartPageContent />
        </Suspense>
    )
}

export default CartPage;