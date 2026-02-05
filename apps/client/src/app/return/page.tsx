import Link from "next/link";

// 'no_payment_required' | 'paid' | 'unpaid'
// 'complete' | 'expired' | 'open'

const ReturnPage = async ({searchParams}: {
    searchParams: Promise<{ session_id: string}> | undefined;
}) => {
    const session_id = (await searchParams)?.session_id;

    if(!session_id){
        return (
            <div>
                <h1>No session id found!</h1>
            </div>
        );
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`
    )
    const data = await res.json();
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
            <h1>Payment {data.status}</h1>
            <p>Payment status: {data.paymentStatus}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                <Link href="/orders">See your orders</Link>
            </button>
        </div>
    );
};

export default ReturnPage;
