import {
  addAnnouncement,
  signInFormSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "@/lib/validators";
import { z } from "zod";

export type signInFormType = z.infer<typeof signInFormSchema>;

export type addAnouncementType = z.infer<typeof addAnnouncement>;

export type updateProfileType = z.infer<typeof updateProfileSchema>;

export type updatePasswordType = z.infer<typeof updatePasswordSchema>;
