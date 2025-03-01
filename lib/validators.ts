import { z } from "zod";

// Schema for signing users in
export const signInFormSchema = z.object({
  name: z.string().regex(/^[A-Za-z]+ [A-Za-z]+$/, {
    message:
      "Full name must contain exactly two words, separated by a single space.",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  credentials: z.string().optional(),
});

export const updatePasswordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(32, { message: "Password must be at most 32 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[\W_]/, {
    message: "Password must contain at least one special character.",
  });
