"use client";

import { ScrollArea } from "./ui/scroll-area";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ProductFormSchema, sizes, colors } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return await res.json();
};

const AddProduct = () => {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to create product!");
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof ProductFormSchema>> = (data) => {
    mutation.mutate(data);
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen pr-4">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <form id="form-add-product" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Name</FieldLabel>
                      <Input
                        {...field}
                        id="form-add-product-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter the name of the product."
                        autoComplete="off"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="shortDescription"
                  control={form.control}
                  render={({ field, fieldState }) => (
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
                />

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
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
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Price</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        id="form-add-product-price"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter the price."
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        autoComplete="off"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="categorySlug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-add-product-category"
                          aria-invalid={fieldState.invalid}
                          className="min-w-[120px]"
                        >
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {categoriesData?.map((category: any) => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="sizes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Sizes</FieldLabel>
                      <div className="grid grid-cols-3 gap-4 my-2">
                        {sizes.map((size) => (
                          <div key={size} className="flex items-center gap-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={field.value?.includes(size)}
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
                />

                <Controller
                  name="colors"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Colors</FieldLabel>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {colors.map((color) => (
                            <div key={color} className="flex items-center gap-2">
                              <Checkbox
                                id={`color-${color}`}
                                checked={field.value?.includes(color)}
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
                                <span className="inline-block size-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                        {field.value?.length > 0 && (
                          <div className="mt-8 space-y-4">
                            <p className="text-sm font-medium">Upload images for selected colors:</p>
                            {field.value.map((color) => (
                              <div className="flex items-center gap-2" key={color}>
                                <div className="size-2 rounded-full" style={{ backgroundColor: color }}></div>
                                <p className="text-xs min-w-[60px]">{color}</p>
                                <Input 
                                  type="text" 
                                  placeholder="Image URL" 
                                  value={form.watch(`images.${color}`) || ""}
                                  onChange={(e) => {
                                    const currentImages = form.getValues("images") || {};
                                    form.setValue("images", { ...currentImages, [color]: e.target.value });
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FieldDescription>
                        Select the available colors and provide image URLs.
                      </FieldDescription>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type="submit" className="w-full mt-10" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Submit"}
              </Button>
            </form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;