import { signInFormSchema } from "@/lib/validators";
import { z } from "zod";

export type signInFormType = z.infer<typeof signInFormSchema>;
