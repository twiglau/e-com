import { auth } from "@clerk/nextjs/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { OrderType } from "@repo/types";

const getData = async (): Promise<OrderType[]> => {
  try {
    const {getToken} = await auth()
    const token = await getToken({template: 'long-lived'});
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
      {
        headers:{
          "Authorization":`Bearer ${token}`
        }
      }
    )
    if(!res.ok){
      throw new Error("Failed to fetch payments")
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
    return []
  }
};

const PaymentsPage = async () => {
    const payments = await getData();
    return (
        <div>
            <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
                <h1 className="text-2xl font-bold">Payments</h1>
                <p className="text-muted-foreground">Manage all payments and transactions</p>
            </div>
            <DataTable columns={columns} data={payments} />
        </div>
    );
};

export default PaymentsPage;