"use client";

import z from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";


const formSchema = z.object({
    fullName: z.string().min(2, "Full name is required").max(50),
    email: z.string().email({message: "Invalid email"}),
    phone: z.string().min(10, "Phone number is required").max(15),
    address: z.string().min(2, "Address is required"),
    city: z.string().min(2)
});

type AddUserFormValues = z.infer<typeof formSchema>;

const AddUser = () => {
    const fieldArray:{
        key: keyof AddUserFormValues;
        label:string;
        placeholder:string;
        type:string;
    }[] = [
        {
            key: "fullName",
            label: "Full Name",
            placeholder: "Enter the full name of the user.",
            type: "text"
        },
        {
            key: "email",
            label: "Email",
            placeholder: "Enter the email of the user.",
            type: "email"
        },
        {
            key: "phone",
            label: "Phone",
            placeholder: "Enter the phone number of the user.",
            type: "tel"
        },
        {
            key: "address",
            label: "Address",
            placeholder: "Enter the address of the user.",
            type: "text"
        },
        {
            key: "city",
            label: "City",
            placeholder: "Enter the city of the user.",
            type: "text"
        }
    ]
    const form = useForm<AddUserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: ""
        }
    });
    const onSubmit: SubmitHandler<AddUserFormValues> = (data) => {
        console.log(data);
    };
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Add User</SheetTitle>
                <SheetDescription asChild>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            {fieldArray.map((field) => (
                                <Controller
                                 key={field.key}
                                 name={field.key}
                                 control={form.control}
                                 render={({field: controllerField, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>{field.label}</FieldLabel>
                                        <Input 
                                        {...controllerField} 
                                        id={`form-add-user-${field.key}`}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={field.placeholder}
                                        autoComplete="off"
                                        />
                                        {fieldState.error && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                             )}
                            ></Controller>
                            ))}
                        </FieldGroup>
                        <Button type="submit" className="w-full mt-10">Submit</Button>
                        
                    </form>
                </SheetDescription>
            </SheetHeader>  
        </SheetContent>
    );
};

export default AddUser;