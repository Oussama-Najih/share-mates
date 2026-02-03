import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

export function usePostCommentsCount(postId: string, initialState: number) {
  const query = useQuery({
    queryKey: ["commentsCount", postId],
    queryFn: () =>
      kyInstance.get(`/api/commentsCount/${postId}`).json<number>(),
    initialData: initialState,
  });

  return query;
}

export function useCommentChildrenCount(
  commentId: string,
  initialState: number,
) {
  const query = useQuery({
    queryKey: ["commentsChildrenCount", commentId],
    queryFn: () =>
      kyInstance.get(`/api/commentsChildrenCount/${commentId}`).json<number>(),
    initialData: initialState,
  });

  return query;
}

type ParentIdsHook = {
  parentIds: string[];
  setParentIds: (ids: string[]) => void;
};

export const useParentIds = create<ParentIdsHook>((set) => ({
  parentIds: [],
  setParentIds: (ids: string[]) => set(() => ({ parentIds: ids })),
}));
