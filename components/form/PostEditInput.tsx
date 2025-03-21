"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react"; // Removed X icon (Cancel)
import { Button } from "../ui/button";
import { useUpdatePostMutation } from "@/lib/mutations/post.mutations";
import LoadingButton from "./LoadingButton";

const PostEditableInput = ({
  isTitle = false,
  initialValue,
  postId,
}: {
  isTitle?: boolean;
  initialValue: string;
  postId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);

  const { mutate, isPending } = useUpdatePostMutation(isTitle);

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
    setTempValue(lastSavedValue);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="py-1 px-2 border rounded-md"
            disabled={isPending} // Prevent changes while loading
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
        <div className="flex items-center space-x-6">
          <span>{lastSavedValue}</span>
          <Button onClick={() => setIsEditing(true)} variant="secondary">
            <Pencil className="cursor-pointer text-blue-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostEditableInput;
