"use client";

import { LikeInfo } from "@/index/prisma/types";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

interface LikeButtonProps {
  commentId?: string;
  postId?: string;
  initialState: LikeInfo;
}

export default function LikeButton({
  commentId,
  postId,
  initialState,
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);

  const queryKey: QueryKey = commentId
    ? ["like-info", "comment", commentId]
    : ["like-info", "post", postId];

  const apiUrl = commentId
    ? `/api/likes/comments/${commentId}`
    : postId
      ? `/api/likes/posts/${postId}`
      : "";

  const { data } = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(apiUrl).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () => {
      return data.isLikedByUser
        ? kyInstance.delete(apiUrl)
        : kyInstance.post(apiUrl);
    },
    onMutate: async () => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, _variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error("Quelque chose s'est mal passé. Veuillez réessayer.");
    },
    onSettled: () => {
      setIsMutating(false);
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isMutating}
      className="mt-2 flex items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
