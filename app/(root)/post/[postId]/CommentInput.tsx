"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitCommentMutation } from "@/lib/mutations/comment.mutations";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";

export default function CommentInput({
  postId,
  parentId,
  setAreChildrenHidden,
}: {
  postId: string;
  parentId: string | null;
  setAreChildrenHidden?: (hidden: boolean) => void;
}) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation({ postId, parentId });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        postId,
        parentId,
        message: input,
      },
      {
        onSuccess: () => {
          setInput("");
          setAreChildrenHidden?.(false);
        },
      },
    );
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Écrire un commentaire..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="flex-1"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
