import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

// Schema for signing users in
export const signInFormSchema = z.object({
  // .regex(/^[A-Za-z]+ [A-Za-z]+$/, {
  //   message:
  //     "Full name must contain exactly two words, separated by a single space.",
  // })
  name: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  credentials: z.string().optional(),
});

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  mediaIds: z.array(z.string()).max(10, "Cannot have more than 5 attachments"),
  option: z.string(),
});

export const addAnnouncement = z.object({
  title: z.string(),
  mediaId: z.string(),
});

export const updateProfileSchema = z.object({
  name: requiredString,
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Password must at least 6 characters long."),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
  credentials: z.string().optional(),
});
