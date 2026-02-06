import { auth } from "@clerk/nextjs/server";
import { OrderType } from "@repo/types";



const fetchOrders = async () => {
    try {
        const { getToken } = await auth();
        const token = await getToken({template: 'long-lived'});

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                next: { revalidate: 60 } // Optional: add simple caching
            }
        );

        if (!res.ok) {
            console.error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
            return [];
        }

        const data: OrderType[] = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}
const OrdersPage = async () => {
    const orders: OrderType[] = await fetchOrders();

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
                <h1 className="text-xl font-medium">No orders found</h1>
                <p className="text-gray-500">You haven&apos;t placed any orders yet or there was an error loading them.</p>
            </div>
        );
    }
    return (
        <div className="">
            <h1 className="text-2xl my-4 font-medium">Your Orders</h1>
            <ul className="flex flex-col gap-4 min-h-[calc(100vh-450px)]">
                {orders.map((order) => (
                    <li key={order._id} className="p-4 flex items-center gap-4 w-full shadow-sm border border-gray-200 rounded-md">
                        <div className="w-1/3">
                           <span className="font-medium text-sm text-gray-500 ">
                              Order ID
                           </span>
                           <p className="text-wrap">{order._id}</p>
                        </div>
                        <div className="w-1/12">
                           <span className="font-medium text-sm text-gray-500">
                              Total
                           </span>
                           <p>{Number(order.amount) / 100}</p>
                        </div>
                        <div className="w-1/12">
                           <span className="font-medium text-sm text-gray-500">
                              Status
                           </span>
                           <p>{order.status}</p>
                        </div>
                        <div className="w-1/8">
                           <span className="font-medium text-sm text-gray-500">
                              Date
                           </span>
                           <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US") : '-'}</p>
                        </div>
                        <div className="">
                           <span className="font-medium text-sm text-gray-500">
                              Products
                           </span>
                           <p>{order.products?.map((p: { name: string }) => p.name).join(', ') || "-"}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrdersPage