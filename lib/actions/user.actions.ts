"use server";

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  signInFormType,
  updatePasswordType,
  updateProfileType,
} from "@/index/validationTypes/types";
import { updatePasswordSchema, updateProfileSchema } from "../validators";
import { getServerUser } from "../serverFuncs";
import { prisma } from "@/db/prisma";
import { getUserDataSelect } from "@/index/prisma/types";
import { compare, hashSync } from "bcrypt-ts-edge";
import { formatError } from "../utils";

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
      message: "Nom ou mot de passe invalide(s)",
    };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function updateUserProfile(value: updateProfileType) {
  try {
    const validatedValue = updateProfileSchema.parse(value);

    const user = await getServerUser();

    if (!user) throw new Error("Unauthorized");

    const userP = await prisma.user.findUnique({ where: { id: user.id } });

    if (!userP) throw new Error("User not found");

    const userWithName = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: user.id } },
          {
            OR: [
              { name: validatedValue.name },
              { original_name: validatedValue.name },
            ],
          },
        ],
      },
    });

    if (userWithName) {
      return null;
    }

    const extendedData = !userP?.original_name
      ? { ...validatedValue, original_name: userP.name }
      : validatedValue;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: extendedData,
      select: getUserDataSelect(user.id),
    });

    return updatedUser;
  } catch (error) {
    return null;
  }
}

export async function changePassword(
  values: updatePasswordType,
  userId: string
) {
  try {
    const { currentPassword, newPassword } = updatePasswordSchema.parse(values);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await compare(currentPassword, user.password);

    // If password is correct, return user
    if (isMatch) {
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashSync(newPassword) },
      });

      // await signOut({ redirectTo: "/sign-in?callbackUrl=/profile" });
      return {
        success: true,
        message: "Nouveau mot de passe a été enregistré",
      };
    }
    return {
      success: false,
      message: "Mot de passe incorrect",
    };
  } catch (error) {
    // if (isRedirectError(error)) {
    //   throw error;
    // }
    return {
      success: false,
      message: formatError(error),
    };
  }
}
