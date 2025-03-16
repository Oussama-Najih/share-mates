"use client";

import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { signInFormType } from "@/index/validationTypes/types";
import { useState, useTransition } from "react";
import PasswordInput from "@/components/form/PasswordInput";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { sx } from "@/CSS_Configs/mui";
import LoadingButton from "@/components/form/LoadingButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInFormSchema } from "@/lib/validators";
import { signInDefaultValues } from "@/lib/constants";

export default function SignInForm() {
  const form = useForm<signInFormType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues:
      process.env.NODE_ENV === "development" ? signInDefaultValues : {},
  });
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = form;

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: signInFormType) => {
    startTransition(async () => {
      const res = await signInWithCredentials(values);
      if (res && !res.success) {
        form.setError("credentials", { message: res.message });
      }
    });
  };

  return (
    <div className="h-[100vh] flex  items-center justify-center bg-[url('/images/knowledge.jpg')] bg-center bg-cover">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 backdrop-blur-sm w-4/6 max-w-[400px] mx-auto flex flex-col border-[1px] bg-transparent p-6 rounded-lg shadow-md"
      >
        <h1 className="text-center font-poppins font-semibold text-[oklch(var(--border-focus))]">
          Welcome to ShareMates
        </h1>
        <div className="space-y-4">
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", {
              onChange: () => clearErrors("credentials"), // Clear error on change
            })}
            autoComplete="off"
            sx={sx}
          />
          <FormProvider {...form}>
            <PasswordInput />
          </FormProvider>
        </div>

        {errors.credentials?.message && (
          <p className="text-center text-destructive">
            {errors.credentials?.message}
          </p>
        )}

        <LoadingButton
          disabled={!!Object.keys(errors).length}
          loading={isPending}
          type="submit"
          className="py-2 font-roboto rounded-lg text-[oklch(var(--button-text))] hover:bg-[oklch(var(--hover-button))] w-4/5 mx-auto bg-[oklch(var(--button-default))] transition-colors duration-300"
        >
          Login
        </LoadingButton>
      </form>
    </div>
  );
}
