"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import LoadingButton from "./LoadingButton";
import { useUpdatePostMutation } from "@/lib/mutations/post.mutations";
import { cn } from "@/lib/utils";

const PostSmoothEditInput = ({
  isTitle = false,
  initialValue,
  postId,
  canEdit,
  className,
}: {
  isTitle?: boolean;
  initialValue: string;
  postId: string;
  canEdit: boolean;
  className?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdatePostMutation(isTitle);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Save the new value
  const handleSave = () => {
    if (
      tempValue.trim() === initialValue ||
      tempValue.trim() === lastSavedValue
    ) {
      setIsEditing(false);
      return;
    }

    mutate(
      { value: tempValue, postId, isTitle },
      {
        onSuccess: () => {
          setLastSavedValue(tempValue);
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(lastSavedValue); // Reset to the last saved value
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={cn("py-1 px-2 border rounded-md", className)}
            disabled={!canEdit || isPending} // Prevent changes while loading
          />
          <LoadingButton
            loading={isPending}
            onClick={handleSave}
            variant="secondary"
            showChildren={false}
          >
            <Check className="cursor-pointer text-green-500" />
          </LoadingButton>
          {!isPending && ( // Hide cancel button while loading
            <Button onClick={handleCancel} variant="secondary">
              <X className="cursor-pointer text-red-500" />
            </Button>
          )}
        </>
      ) : (
        <div
          className={`w-full text-blue-500  px-2 py-1 text-center rounded-md ${
            canEdit && "cursor-pointer"
          }`}
          onClick={() => canEdit && setIsEditing(true)}
        >
          {lastSavedValue}
        </div>
      )}
    </div>
  );
};

export default PostSmoothEditInput;
