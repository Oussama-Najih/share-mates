"use client";

import { formatRelativeDate } from "@/lib/utils";
import Comments from "./Comments";
import { useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { CommentData } from "@/index/prisma/types";
import { useDeleteCommentMutation } from "@/lib/mutations/comment.mutations";
import { useSession } from "next-auth/react";

type CommentProps = {
  comment: CommentData;
};

export default function Comment({ comment }: CommentProps) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);

  const mutation = useDeleteCommentMutation();

  const { data } = useSession();

  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">@{comment.user.name}</h2>
          <span className="text-sm text-gray-500">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <p className="break-words">{comment.message}</p>
      </div>

      <>
        {/* Toggle Replies Button */}
        <div className="flex justify-between items-center">
          <button
            className="text-sm text-blue-600 hover:underline mt-2"
            onClick={() => setAreChildrenHidden((prev) => !prev)}
          >
            {areChildrenHidden ? "Show Replies" : "Hide Replies"}
          </button>
          {data?.user.id === comment.userId && (
            <button onClick={() => mutation.mutate(comment.id)}>
              {!mutation.isPending ? (
                <Trash size={20} className="hover:text-destructive" />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </button>
          )}
        </div>

        {/* Child Comments */}
        {!areChildrenHidden && (
          <div className="mt-3 pl-4 border-l border-gray-300 dark:border-gray-600">
            <Comments postId={comment.postId} parentId={comment.id} />
          </div>
        )}
      </>
    </div>
  );
}
