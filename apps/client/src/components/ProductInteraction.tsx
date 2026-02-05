'use client';

import React from 'react';
import { ProductType } from "@repo/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'react-toastify';

const ProductInteraction = ({
    product,
    size,
    color
}:{
    product: ProductType;
    size: string;
    color: string;
}) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [quantity, setQuantity] = React.useState(1);

    const { addToCart, cart } = useCartStore();


    React.useEffect(() => {
        const item = cart.find((item) => item.id === product.id);
        if (item) {
            setQuantity(item.quantity);
        }
    }, [cart, product.id]);

    const handleTypeChange = (type: "size" | "color", value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(type, value);
        router.push(`${pathname}?${params.toString()}`, {scroll: false});
    }
    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (type === "increment") {
            setQuantity((prev) => prev + 1);
        } else {
            if (quantity > 1) {
                setQuantity((prev) => prev - 1);
            }
        }
    }
    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity,
            size,
            color
        })
        toast.success("Product added to cart");
    }
    const handleBuyNow = () => {}
    return (
        <div className="flex flex-col gap-4 mt-4">
            {/* SIZE */}
            <div className="flex flex-col gap-2 text-xs">
                <span className="text-gray-500">Size</span>
                <div className="flex items-center gap-2">
                    {product.sizes.map((s) => (
                        <div
                            key={s}
                            className={`cursor-pointer border-1 p-[2px] ${
                                size === s ? "border-gray-600" : "border-gray-300"
                            }`}
                            onClick={() => handleTypeChange("size", s)}
                        >
                            <div
                                className={`w-6 h-6 flex items-center justify-center ${
                                    size === s ? "bg-black text-white" : "bg-white text-black"
                                }`}
                            >
                                {s.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* COLOR */}
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-gray-500">Color</span>
                <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                        <div
                            key={c}
                            className={`cursor-pointer border-1 p-[2px] ${
                                color === c ? "border-gray-300" : "border-white"
                            }`}
                            onClick={() => handleTypeChange("color", c)}
                        >
                            <div
                                className={`w-6 h-6 rounded-sm`}
                                style={{backgroundColor: c}}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* QUANTITY */}
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-gray-500">Quantity</span>
                <div className="flex items-center gap-2">
                    <button 
                      className="cursor-pointer border-1 border-gray-300 p-1"
                      onClick={() => handleQuantityChange("decrement")}
                    >
                        <Minus className="size-4" />
                    </button>
                    <span className='inline-block min-w-5 text-center text-base'>{quantity}</span>
                    <button 
                      className="cursor-pointer border-1 border-gray-300 p-1"
                      onClick={() => handleQuantityChange("increment")}
                    >
                        <Plus className="size-4" />
                    </button>
                </div>
            </div>
            {/* BUTTONS */}
            <div className='flex items-center gap-4'>
                <button 
                 onClick={() => handleAddToCart()}
                className="flex items-center gap-2 cursor-pointer bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg font-medium">
                    <Plus className='size-4' />
                    Add to Cart
                </button>
                <button 
                 onClick={() => handleBuyNow()}
                className="flex items-center gap-2 cursor-pointer ring-1 ring-gray-400 px-4 py-2 rounded-md shadow-lg font-medium">
                    <ShoppingCart className='size-4' />
                    Buy this Item
                </button>
            </div>
        </div>
    )
}

export default ProductInteraction;