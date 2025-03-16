"use client";

import { formatRelativeDate } from "@/lib/utils";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import { Loader2, Trash } from "lucide-react";
import { CommentData } from "@/index/prisma/types";
import { useDeleteCommentMutation } from "@/lib/mutations/comment.mutations";
import { useSession } from "next-auth/react";
import LikeButton from "./LikeButton";
import { useSearchParams } from "next/navigation";
import UserAvatar from "@/components/user/UserAvatar";

type CommentProps = {
  comment: CommentData;
  userId: string;
};

export default function Comment({ comment, userId }: CommentProps) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);

  const mutation = useDeleteCommentMutation();

  return (
    <div
      id={comment.id}
      className="mb-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <UserAvatar size={40} avatarUrl={comment.user.image} />
            <h2 className="font-semibold">@{comment.user.name}</h2>
          </div>
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
          {userId === comment.userId && (
            <button onClick={() => mutation.mutate(comment.id)}>
              {!mutation.isPending ? (
                <Trash size={20} className="hover:text-destructive" />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </button>
          )}
        </div>
        <LikeButton
          commentId={comment.id}
          initialState={{
            likes: comment.likes.length,
            isLikedByUser: comment.likes.some((like) => like.userId === userId),
          }}
        />

        {/* Child Comments */}
        {!areChildrenHidden && (
          <div className="mt-3 pl-4 border-l border-gray-300 dark:border-gray-600">
            <Comments
              userId={userId}
              postId={comment.postId}
              parentId={comment.id}
            />
          </div>
        )}
      </>
    </div>
  );
}
