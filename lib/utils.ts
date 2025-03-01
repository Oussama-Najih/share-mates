import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.errors.map((e) => e.message).join(". ");
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const field = error.meta?.targeto
      ? (error.meta.target as string[])[0]
      : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}
