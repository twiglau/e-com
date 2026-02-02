

import { ShippingFormInputsType, shippingFormSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";


const ShippingForm = ({
    setShippingForm
}: {
    setShippingForm: (data: ShippingFormInputsType) => void;
}) => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<ShippingFormInputsType>({
        resolver: zodResolver(shippingFormSchema as any),
    });
    const router = useRouter();
    const onSubmit: SubmitHandler<ShippingFormInputsType> = (data) => {
        setShippingForm(data);
        router.push("/cart?step=3", {scroll: false});
    }
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm text-gray-500 font-medium">Name</label>
                <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="border-b border-gray-200 rounded-lg py-2 outline-none text-sm"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm text-gray-500 font-medium">Email</label>
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="border-b border-gray-200 rounded-lg py-2 outline-none text-sm"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm text-gray-500 font-medium">Phone</label>
                <input
                    type="text"
                    id="phone"
                    {...register("phone")}
                    className="border-b border-gray-200 rounded-lg py-2 outline-none text-sm"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="address" className="text-sm text-gray-500 font-medium">Address</label>
                <input
                    type="text"
                    id="address"
                    {...register("address")}
                    className="border-b border-gray-200 rounded-lg py-2 outline-none text-sm"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="city" className="text-sm text-gray-500 font-medium">City</label>
                <input
                    type="text"
                    id="city"
                    {...register("city")}
                    className="border-b border-gray-200 rounded-lg py-2 outline-none text-sm"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
            </div>
            <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
            >
                Continue
                <ArrowRight className="size-3" />
            </button>
        </form>
    )
}

export default ShippingForm;