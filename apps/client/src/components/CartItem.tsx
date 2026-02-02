import { CartItemType } from "@/types"
import { Trash2 } from "lucide-react"
import Image from "next/image"

type CartItemProps = {
    item: CartItemType,
    removed: (id: string | number) => void
}
const CartItem = ({ item, removed }: CartItemProps) => {
    return (
        <div className="flex items-center justify-between">
            <div  className="flex gap-8">
                <div className="relative size-32 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                    src={item.images?.[item.color] || ""}
                    alt={item.name}
                    fill
                    className="object-contain"
                    />
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                            Size: {item.size}
                        </p>
                        <p className="text-xs text-gray-500">
                            Color: {item.color}
                        </p>
                    </div>
                    <p className="text-sm font-medium">${item.price}</p>
                </div>
            </div>
            <button 
            className="size-8 rounded-full bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
            onClick={() => removed(item.id)}>
                <Trash2 className="size-3" />
            </button>
        </div>
    )
}

export default CartItem;