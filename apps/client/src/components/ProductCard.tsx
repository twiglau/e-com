"use client";


import { ProductType } from "@repo/types"
import Link from "next/link"
import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const CART_BUTTON_CLASSES = "ring-1 ring-gray-300 shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer hover:text-white hover:bg-black transition-all duration-300 flex items-center gap-2";

const ProductCard = ({product}: {product: ProductType}) => {

    const [productTypes, setProductTypes] = React.useState({
        size: product.sizes[0],
        color: product.colors[0]
    })
    const { addToCart } = useCartStore();

    const handleProductType = ({type,value}:{type: "size" | "color", value: string}) => {
        setProductTypes((prev) => ({
            ...prev,
            [type]: value
        }))
    }
    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity: 1,
            size: productTypes.size || '',
            color: productTypes.color || ''
        })
    }
    return (
        <div className="shadow-lg rounded-lg overflow-hidden">
            {/* IMAGE */}
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-2/3">
                    <Image
                        src={(product.images as Record<string, string>)?.[productTypes.color as string] || ''}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-110 transition duration-300"
                    />  
                </div>
            </Link>
            {/* PRODUCT DETAILS */}
            <div className="flex flex-col gap-4 p-4">
                <h1 className="font-medium">{product.name}</h1>
                <p className="text-sm text-gray-500">{product.shortDescription}</p>
                {/* PRODUCT TYPES */}
                <div className="flex items-center gap-4 text-xs">
                    {/* SIZES */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500">Size</span>
                        <select
                         name="size"
                         id="size"
                         className="ring ring-gray-300 rounded-md px-2 py-1"
                         onChange={(e) => handleProductType({type: "size", value: e.target.value})}
                        >
                            {product.sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* COLORS */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500">Color</span>
                        <div className="flex items-center gap-2">
                            {product.colors.map((color) => (
                                <div
                                    key={color}
                                    onClick={() => handleProductType({type: "color", value: color})}
                                    className={`cursor-pointer border bg-gray-200 ${
                                        productTypes.color === color ? 
                                        "border-gray-400" : 
                                        "border-gray-200"
                                    } rounded-full p-[1.2px]`}
                                >
                                    <div
                                        className="size-[14px] rounded-full"
                                        style={{backgroundColor: color}}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* PRICE AND AND TO CART BUTTON */}
                <div className="flex items-center justify-between">
                    <span className="font-medium">${product.price.toLocaleString('en-US')}</span>
                    <button className={CART_BUTTON_CLASSES} onClick={handleAddToCart}>
                        <ShoppingCart className="size-4" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard