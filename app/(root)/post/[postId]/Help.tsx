"use client";

import { PostData } from "@/index/prisma/types";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Comments from "../../matieres/_posts/Comments";
import CommentCount from "./CommentCount";

export default function Help({ post }: { post: PostData }) {
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="w-full  items-center">
      <div className="flex flex-col gap-y-5 items-start">
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="size-5" />
          <CommentCount postId={post.id} initialState={post.comments.length} />
        </button>
        {showComments && (
          <div className="border-2 rounded-lg w-full">
            <Comments postId={post.id} parentId={null} />
          </div>
        )}
      </div>
    </div>
  );
}
