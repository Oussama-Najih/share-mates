"use server";

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInFormType } from "@/index/validationTypes/types";

/// Sign in the user with credentials
export async function signInWithCredentials(formData: signInFormType) {
  try {
    await signIn("credentials", formData);

    return { success: true, message: "Logged In successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid name or password",
    };
  }
}

export async function signOutUser() {
  console.log("signout");
  await signOut();
}
