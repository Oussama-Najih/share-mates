import { TextField } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { EyeOff, EyeIcon } from "lucide-react";
import { sx } from "@/CSS_Configs/mui";

export default function PasswordInput() {
  const {
    register,
    formState: { errors },
    clearErrors,
  } = useFormContext<{ password: string; credentials: string }>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex">
      <TextField
        className="w-full"
        label="Password"
        variant="outlined"
        type={showPassword ? "text" : "password"}
        fullWidth
        {...register("password", {
          onChange: () => clearErrors("credentials"), // Clear error on change
        })}
        sx={{ ...sx, mt: 2 }}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="button"
        variant="ghost"
        className="hover:bg-[oklch(var(--button-pw))] text-[oklch(var(--icon-color))] transition-colors duration-300 absolute right-2 top-[1.8rem] p-2"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeIcon /> : <EyeOff />}
      </Button>
    </div>
  );
}
