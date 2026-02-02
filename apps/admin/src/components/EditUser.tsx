"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";

import { Button } from "./ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters!" })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  phone: z.string().min(10).max(15),
  address: z.string().min(2),
  city: z.string().min(2),
});

const EditUser = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "John Doe",
      email: "john.doe@gmail.com",
      phone: "+1 234 5678",
      address: "123 Main St",
      city: "New York",
    },
  });
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="mb-4">Edit User</SheetTitle>
        <SheetDescription asChild>
            <form className="space-y-8">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                  <Field>
                      <FieldLabel>Full Name</FieldLabel>
                      <Input 
                      {...field} 
                      id={`form-add-user-name`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Enter user full name`}
                      autoComplete="off"
                      />
                      {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                  <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input 
                      {...field} 
                      id={`form-add-user-email`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Enter user email`}
                      autoComplete="off"
                      />
                      {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                  <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <Input 
                      {...field} 
                      id={`form-add-user-phone`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Enter user phone`}
                      autoComplete="off"
                      />
                      {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                  <Field>
                      <FieldLabel>Address</FieldLabel>
                      <Input 
                      {...field} 
                      id={`form-add-user-address`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Enter user address`}
                      autoComplete="off"
                      />
                      {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
              </FieldGroup>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="city"
                  render={({ field, fieldState }) => (
                  <Field>
                      <FieldLabel>City</FieldLabel>
                      <Input 
                      {...field} 
                      id={`form-add-user-city`}
                      aria-invalid={fieldState.invalid}
                      placeholder={`Enter user city`}
                      autoComplete="off"
                      />
                      {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                      )}
                  </Field>
                )}
              />
              </FieldGroup>
              <Button type="submit">Submit</Button>
            </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default EditUser;
