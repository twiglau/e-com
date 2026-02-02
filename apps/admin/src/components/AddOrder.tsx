"use client";

import z from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

const statusEnumArray = ["pending", "processing", "success", "failed"] as const;

export type StatusEnum = typeof statusEnumArray[number];

const formSchema = z.object({
    amount: z.number().min(1, "Amount must be at least 1"),
    userId: z.string().min(1, "User ID is required"),
    status: z.enum(statusEnumArray),
    
});

type AddOrderFormValues = z.infer<typeof formSchema>;

const AddOrder = () => {
    const form = useForm<AddOrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            userId: "",
            status: "pending",
        }
    })
    const fields: {
        key: keyof AddOrderFormValues;
        label: string,
        description: string,
        type: string,
    }[] = [
        {
            key: "amount",
            label: "Amount",
            description: "Enter the amount of the order",
            type: "number",
        },
        {
            key: "userId",
            label: "User ID",
            description: "Enter the user ID",
            type: "string",
        },
        {
            key: "status",
            label: "Status",
            description: "Select a status",
            type: "enum",
        }
    ]

    const onSubmit: SubmitHandler<AddOrderFormValues> = (data) => {
        console.log(data);
    }

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="mb-4">Add Order</SheetTitle>
                <SheetDescription asChild>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            {fields.map((field) => (
                                <Controller
                                    key={field.key}
                                    name={field.key}
                                    control={form.control}
                                    render={({field: controllerField, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>{field.label}</FieldLabel>
                                            {field.type !== "enum" ? (
                                                <Input  
                                                {...controllerField} 
                                                id={`form-add-order-${field.key}`}
                                                aria-invalid={fieldState.invalid}
                                                placeholder={field.description}
                                            autoComplete="off"
                                            />
                                            ) : (
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={field.description} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusEnumArray.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {fieldState.error && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            ))}
                            <Button type="submit" className="w-full mt-10">Submit</Button>
                        </FieldGroup>
                    </form>
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    )
    
}

export default AddOrder;