"use client";

import { PostData } from "@/index/prisma/types";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Comments from "../../matieres/_posts/Comments";
import CommentCount from "./CommentCount";
import LikeButton from "../../matieres/_posts/LikeButton";

export default function Help({
  post,
  userId,
}: {
  post: PostData;
  userId: string;
}) {
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="w-full  items-center">
      <div className="flex flex-col gap-y-5 items-start">
        <div className="flex items-end gap-4">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post.likes.length,
              isLikedByUser: post.likes.some((like) => like.userId === userId),
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
        {showComments && (
          <div className="border-2 rounded-lg w-full">
            <Comments userId={userId} postId={post.id} parentId={null} />
          </div>
        )}
      </div>
    </div>
  );
}
