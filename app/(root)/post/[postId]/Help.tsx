"use client";

import { PostData } from "@/index/prisma/types";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import CommentCount from "./CommentCount";
import DeleteButton from "@/components/posts/DeleteButton";
import Comments from "@/components/comments/Comments";
import LikeButton from "@/components/comments/LikeButton";

export default function Help({
  post,
  userId,
}: {
  post: PostData;
  userId: string;
}) {
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="w-full items-center">
      <div className="flex flex-col gap-y-5 items-start w-full">
        <div className="flex items-end px-2 w-full">
          <div className="flex items-end gap-6">
            <LikeButton
              postId={post.id}
              initialState={{
                likes: post.likes.length,
                isLikedByUser: post.likes.some(
                  (like) => like.userId === userId
                ),
              }}
            />
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="size-5" />
              <CommentCount
                postId={post.id}
                initialState={post.comments.length}
              />
            </button>
          </div>

          {/* Move the DeleteButton to the far right */}
          {post.authorId === userId ? (
            <div className="ml-auto">
              {" "}
              {/* This makes the DeleteButton align to the right */}
              <DeleteButton post={post} className="transition-opacity" />
            </div>
          ) : null}
        </div>

        {showComments && (
          <div className="border-2 rounded-lg w-full">
            <Comments userId={userId} postId={post.id} parentId={null} />
          </div>
        )}
      </div>
    </div>
  );
}
