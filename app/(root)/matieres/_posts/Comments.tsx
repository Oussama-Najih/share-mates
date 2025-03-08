"use client";

import kyInstance from "@/lib/ky";
import { QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";
import { CommentsPage, PostData } from "@/index/prisma/types";
import CommentInput from "../../post/[postId]/CommentInput";
import { Button } from "@/components/ui/button";

export default function Comments({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string | null;
}) {
  const queryKey: QueryKey = parentId
    ? ["comments", postId, parentId]
    : ["comments", postId, "root"];

  const apiUrl = parentId
    ? `/api/comments/${postId}/${parentId}`
    : `/api/comments/${postId}/root`;

  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam }) => {
        return kyInstance
          .get(apiUrl, pageParam ? { searchParams: { cursor: pageParam } } : {})
          .json<CommentsPage>();
      },
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.nextCursor,
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {/* Comment Input */}
      <div className="mb-3">
        <CommentInput postId={postId} parentId={parentId} />
      </div>

      {/* Loading State */}
      {status === "pending" && (
        <div className="flex justify-center mt-3">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      )}

      {/* No Comments Message */}
      {status === "success" && !comments.length && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No comments yet.
        </p>
      )}

      {/* Error Message */}
      {status === "error" && (
        <p className="text-center text-red-500">
          An error occurred while loading comments.
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block mt-2"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          {isFetching ? "Loading..." : "Load previous comments"}
        </Button>
      )}
    </div>
  );
}
