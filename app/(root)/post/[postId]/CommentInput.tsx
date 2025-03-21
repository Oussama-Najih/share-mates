"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubmitCommentMutation } from "@/lib/mutations/comment.mutations";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";

export default function CommentInput({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string | null;
}) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation({ postId, parentId });

  async function onSubmit(e: React.FormEvent) {
    //prevent page refresh. React hook form prevents this
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        postId,
        parentId,
        message: input,
      },
      {
        //         Both onSuccess callbacks are executed:
        // First, the mutation’s onSuccess (inside useMutation) runs
        // It updates the query cache
        // It shows a success toast
        // Then, the additional onSuccess passed to mutate() runs
        // onClose() is executed (which likely closes the dialog)
        // ✅ React Query ensures both are executed in the correct order.
        onSuccess: () => setInput(""),
      }
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
