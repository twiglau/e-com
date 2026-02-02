import { PaymentFormInputsType,paymentFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";


const PaymentForm = () => {

    const {
        register, 
        handleSubmit, 
        formState: {errors}
    } = useForm<PaymentFormInputsType>({
        resolver: zodResolver(paymentFormSchema as any)
    })

    const onSubmit:SubmitHandler<PaymentFormInputsType> = (data) => {
        console.log(data)
    }
    return (
        <form  
        className="flex flex-col gap-4" 
        onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 text-medium" htmlFor="cardHolder">Card Holder Name</label>
                <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cardHolder" {...register("cardHolder")} />
                {errors.cardHolder && <p className="text-red-500 text-xs">{errors.cardHolder.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 text-medium" htmlFor="cardNumber">Card Number</label>
                <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cardNumber" {...register("cardNumber")} />
                {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 text-medium" htmlFor="expiryDate">Expiry Date</label>
                <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="expiryDate" {...register("expirationDate")} />
                {errors.expirationDate && <p className="text-red-500 text-xs">{errors.expirationDate.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 text-medium" htmlFor="cvv">CVV</label>
                <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cvv" {...register("cvv")} />
                {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv.message}</p>}
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Image src="/klarna.png" alt="klarna" width={50} height={25} className="rounded-md"/>
                <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md"/>
                <Image src="/stripe.png" alt="stripe" width={50} height={25} className="rounded-md"/>
            </div>
            <button type="submit" className="w-full bg-gray-700 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                Pay Now
            </button>
        </form>
    )
}

export default PaymentForm;