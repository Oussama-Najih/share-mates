"use client";

import { formatRelativeDate } from "@/lib/utils";
import Comments from "./Comments";
import { useState } from "react";
import { CommentData } from "@/index/prisma/types";
import { useDeleteCommentMutation } from "@/lib/mutations/comment.mutations";
import UserAvatar from "@/components/user/UserAvatar";
import LikeButton from "./LikeButton";
import DeleteButton from "../posts/DeleteButton";
import CommentEditableInput from "../form/CommentEditInput";
import { Edit, MessageCircle } from "lucide-react";
import CommentInput from "@/app/(root)/post/[postId]/CommentInput";
import CommentCount from "./CommentCount";
import { json } from "stream/consumers";
import { useParentIds } from "@/lib/hooks";

type CommentProps = {
  comment: CommentData;
  userId: string;
};

export default function Comment({ comment, userId }: CommentProps) {
  const { parentIds } = useParentIds();
  const [areChildrenHidden, setAreChildrenHidden] = useState(
    !parentIds.includes(comment.id),
  );
  const [showCommentInput, setShowCommentInput] = useState(false);

  const mutation = useDeleteCommentMutation();

  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="hidden sm:flex items-center gap-4">
            <UserAvatar
              userId={comment.userId}
              isInComment={true}
              size={40}
              avatarUrl={comment.user.image}
            />
            <h2 className="sm:hidden font-semibold">@{comment.user.name}</h2>
          </div>
          <h2 className="font-semibold">@{comment.user.name}</h2>
          <span className="hidden md:block text-sm text-gray-500">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <CommentEditableInput
          initialValue={comment.message}
          comment={comment}
          canEdit={userId === comment.userId}
        />
      </div>

      <>
        {/* Toggle Replies Button */}
        <div className="flex gap-2 justify-between items-center">
          <div className="flex gap-4 md:gap-8 items-end">
            <CommentCount
              commentId={comment.id}
              initialState={comment.children.length}
              areChildrenHidden={areChildrenHidden}
              setAreChildrenHidden={setAreChildrenHidden}
            />
            <LikeButton
              commentId={comment.id}
              initialState={{
                likes: comment.likes.length,
                isLikedByUser: comment.likes.some(
                  (like) => like.userId === userId,
                ),
              }}
            />
            <Edit
              size={20}
              onClick={() => setShowCommentInput((prev) => !prev)}
            />
          </div>
          {userId === comment.userId && <DeleteButton comment={comment} />}
        </div>
        {showCommentInput ? (
          <div className="mt-5">
            <CommentInput postId={comment.postId} parentId={comment.id} />
          </div>
        ) : null}
        {/* Child Comments */}
        {!areChildrenHidden && (
          <div className="mt-3 pl-4 relative">
            {/* Clickable Left Border */}
            <div
              onClick={() => setAreChildrenHidden((prev) => !prev)}
              className="absolute top-0 left-0 h-full w-6 cursor-pointer"
            >
              <div className="h-full w-1 bg-blue-400 dark:bg-blue-300" />
            </div>

            {/* Comments Section */}
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
