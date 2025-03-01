import { signInFormSchema } from "@/lib/validators";
import { z } from "zod";
import { User } from "@prisma/client";

export type signInFormType = z.infer<typeof signInFormSchema>;

export type UserInfo = Omit<User, "password">;
