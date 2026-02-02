"use client";

import { ScrollArea } from "./ui/scroll-area";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const categories = [
  "T-shirts",
  "Shoes",
  "Accessories",
  "Bags",
  "Dresses",
  "Jackets",
  "Gloves",
] as const;

const colors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
] as const;

const sizes = [
  "xs",
  "s",
  "m",
  "l",
  "xl",
  "xxl",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
] as const;

const formSchema = z.object({
    name: z.string().min(1, {message: "Product name is required"}),
    shortDescription: z.string().min(1, {message: "Product short description is required"}).max(100),
    description: z.string().min(1, {message: "Product description is required"}),
    price: z.number(),
    category: z.enum(categories),
    colors: z.array(z.enum(colors)),
    sizes: z.array(z.enum(sizes)),
    images: z.record(z.enum(colors), z.string()),
});
type FormData = z.infer<typeof formSchema>;


const AddProduct = () => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            shortDescription: "",
            description: "",
            price: 0,
            category: categories[0],
            colors: [],
            sizes: [],
            images: {},
        },
    });
    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);
    };
    return (
        <SheetContent>
            <ScrollArea className="h-screen">
                <SheetHeader>
                    <SheetTitle className="mb-4">Add Product</SheetTitle>
                    <SheetDescription asChild>
                        <form id="form-add-product" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                 name="name"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Name</FieldLabel>
                                      <Input 
                                      {...field} 
                                      id="form-add-product-title"
                                      aria-invalid={fieldState.invalid}
                                      placeholder="Enter the name of the product."
                                      autoComplete="off"
                                      />
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>
                                <Controller
                                 name="shortDescription"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Short Description</FieldLabel>
                                      <Input 
                                      {...field} 
                                      id="form-add-product-short-description"
                                      aria-invalid={fieldState.invalid}
                                      placeholder="Enter the short description of the product."
                                      autoComplete="off"
                                      />
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>
                                <Controller
                                 name="description"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Description</FieldLabel>
                                      <Input 
                                      {...field} 
                                      id="form-add-product-description"
                                      aria-invalid={fieldState.invalid}
                                      placeholder="Enter the description of the product."
                                      autoComplete="off"
                                      />
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>
                                <Controller
                                 name="price"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Price</FieldLabel>
                                      <Input 
                                      {...field} 
                                      type="number"
                                      id="form-add-product-price"
                                      aria-invalid={fieldState.invalid}
                                      placeholder="Enter the price of the product."
                                      autoComplete="off"
                                      />
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>
                                <Controller
                                 name="category"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Price</FieldLabel>
                                      <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                            id="form-rhf-select-language"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-[120px]"
                                            >
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned">
                                            {categories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                {category}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select> 
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>

                                <Controller
                                 name="sizes"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Sizes</FieldLabel>
                                      <div className="grid grid-cols-3 gap-4 my-2">
                                        {sizes.map((size) => (
                                          <div key={size} className="flex items-center gap-2">
                                            <Checkbox
                                              id={`size-${size}`}
                                              checked={!!field.value?.includes(size)}
                                              onCheckedChange={(checked) => {
                                                const currentValues = field.value || [];
                                                if (checked) {
                                                  field.onChange([...currentValues, size]);
                                                } else {
                                                  field.onChange(currentValues.filter((s) => s !== size));
                                                }
                                              }}
                                            />
                                            <label htmlFor={`size-${size}`} className="text-xs">{size}</label>
                                          </div>
                                        ))}
                                      </div>
                                      <FieldDescription>
                                        Select the available sizes for the product.
                                      </FieldDescription>
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>

                                <Controller
                                 name="colors"
                                 control={form.control}
                                 render={({field, fieldState}) => (
                                   <Field data-invalid={fieldState.invalid}>
                                      <FieldLabel>Colors</FieldLabel>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4 my-2">
                                            {colors.map((color) => (
                                            <div key={color} className="flex items-center gap-2">
                                                <Checkbox
                                                id={`color-${color}`}
                                                checked={!!field.value?.includes(color)}
                                                onCheckedChange={(checked) => {
                                                    const currentValues = field.value || [];
                                                    if (checked) {
                                                    field.onChange([...currentValues, color]);
                                                    } else {
                                                    field.onChange(currentValues.filter((s) => s !== color));
                                                    }
                                                }}
                                                />
                                                <label htmlFor={`color-${color}`} className="text-xs">
                                                    <span className="inline-block size-2 rounded-full mr-2" style={{backgroundColor: color}}></span>
                                                    {color}
                                                </label>
                                            </div>
                                            ))}
                                        </div>
                                        {field.value?.length > 0 && (
                                            <div className="mt-8 space-y-4">
                                                <p className="text-sm font-medium">Upload images for select colors:</p>
                                                {field.value.map((color) => (
                                                    <div className="flex items-center gap-2" key={color}>
                                                        <div className="size-2 rounded-full" style={{backgroundColor: color}}></div>
                                                        <p className="text-xs min-w-[60px]">{color}</p>
                                                        <Input type="file" accept="image/*" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                      </div>
                                      <FieldDescription>
                                        Select the available colors for the product.
                                      </FieldDescription>
                                      {fieldState.error && (
                                        <FieldError errors={[fieldState.error]} />
                                      )}
                                   </Field>
                                 )}
                                ></Controller>
                            </FieldGroup>
                            <Button type="submit" className="w-full mt-10">Submit</Button>
                        </form>
                    </SheetDescription>
                </SheetHeader>
            </ScrollArea>
        </SheetContent>
    );
};

export default AddProduct;