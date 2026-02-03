import z from "zod";

export interface CustomJwtSessionClaims {
  metadata?: {
    role?: "admin" | "user";
  };
}

export const UserFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50),
  emailAddress: z.array(
    z.string({ message: "Email address is required" }).email(),
  ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 6 characters long" })
    .max(50),
});
