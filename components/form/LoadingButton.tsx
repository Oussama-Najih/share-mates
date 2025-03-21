import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  showChildren?: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  showChildren = true,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {!showChildren && loading ? null : props.children}
    </Button>
  );
}
