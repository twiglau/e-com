'use client';


import { Controller } from "react-hook-form";
import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";


const formSchema = z.object({
    name: z.string().min(1, {message: "Category name is required"}),
});
type FormData = z.infer<typeof formSchema>;


const AddCategory = () => {

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    };

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle className="mb-4">Add Category</SheetTitle>
            </SheetHeader>
            <SheetDescription asChild>
                <form className="px-4" id="form-add-category" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                         name="name"    
                         control={form.control}
                         render={({field, fieldState}) => (
                           <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Name</FieldLabel>
                              <Input 
                              {...field} 
                              id="form-add-category-name"
                              aria-invalid={fieldState.invalid}
                              placeholder="Enter the name of the category."
                              autoComplete="off"
                              />
                              {fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                           </Field>
                         )}
                        ></Controller>  
                    </FieldGroup>
                    <Button className="w-full mt-4" type="submit">Submit</Button>
                </form>
            </SheetDescription>
        </SheetContent>
    );
};

export default AddCategory;