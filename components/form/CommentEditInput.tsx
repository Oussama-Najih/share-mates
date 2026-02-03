"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import LoadingButton from "./LoadingButton";
import { useUpdateCommentMutation } from "@/lib/mutations/comment.mutations";
import { CommentData } from "@/index/prisma/types";

const CommentEditableInput = ({
  initialValue,
  comment,
  canEdit,
}: {
  initialValue: string;
  comment: CommentData;
  canEdit: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);
  const [tempValue, setTempValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateCommentMutation(
    comment.postId,
    comment.parentId ?? "root",
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (
      tempValue.trim() === initialValue ||
      tempValue.trim() === lastSavedValue
    ) {
      setIsEditing(false);
      return;
    }

    mutate(
      { id: comment.id, content: tempValue },
      {
        onSuccess: () => {
          setLastSavedValue(tempValue);
          setIsEditing(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(lastSavedValue);
  };

  return (
    <div id={comment.id} className="flex items-center gap-2">
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="py-1 px-2 border rounded-md"
            disabled={!canEdit || isPending}
          />
          <LoadingButton
            loading={isPending}
            onClick={handleSave}
            variant="secondary"
            showChildren={false}
          >
            <Check className="cursor-pointer text-green-500" />
          </LoadingButton>
          {!isPending && (
            <Button onClick={handleCancel} variant="secondary">
              <X className="cursor-pointer text-red-500" />
            </Button>
          )}
        </>
      ) : (
        <div
          className="w-full  px-2 py-1 rounded-md"
          onClick={() => canEdit && setIsEditing(true)}
        >
          {lastSavedValue}
        </div>
      )}
    </div>
  );
};

export default CommentEditableInput;
