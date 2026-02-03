import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteComment,
  submitComment,
  updateComment,
} from "../actions/comment.actions";
import { CommentsPage } from "@/index/prisma/types";
import toast from "react-hot-toast";

export function useSubmitCommentMutation({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string | null;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = parentId
        ? ["comments", postId, parentId]
        : ["comments", postId, "root"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];

          if (!firstPage) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                ...firstPage,
                comments: [newComment, ...firstPage.comments],
              },
              ...oldData.pages.slice(1),
            ],
          };
        },
      );

      queryClient.setQueryData(
        ["commentsCount", `${newComment.postId}`],
        (oldData: number | undefined) => (oldData ?? 0) + 1,
      );

      parentId &&
        queryClient.setQueryData(
          ["commentsChildrenCount", `${parentId}`],
          (oldData: number | undefined) => (oldData ?? 0) + 1,
        );

      toast.success("Commentaire créé");
    },
    onError(error) {
      console.error(error);
      toast.error("La soumission du commentaire a échoué. Veuillez réessayez.");
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async ({ deletedComment, descendantsCount }) => {
      const queryKey: QueryKey = deletedComment.parentId
        ? ["comments", deletedComment.postId, deletedComment.parentId]
        : ["comments", deletedComment.postId, "root"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.filter((c) => c.id !== deletedComment.id),
            })),
          };
        },
      );

      queryClient.setQueryData(
        ["commentsCount", `${deletedComment.postId}`],
        (oldData: number | undefined) =>
          Math.max((oldData ?? 0) - descendantsCount - 1, 0),
      );

      toast.success("Commentaire supprimé avec succès");
    },
    onError(error) {
      console.error(error);
      toast.error(
        "Échec de la suppression du commentaire. Veuillez réessayer.",
      );
    },
  });

  return mutation;
}

export function useUpdateCommentMutation(postId: string, parentId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateComment,
    onSuccess: async (updatedComment) => {
      const queryFilter: QueryFilters<
        InfiniteData<CommentsPage, string | null>
      > = {
        queryKey: ["comments", postId, parentId],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<CommentsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              comments: page.comments.map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment,
              ),
            })),
          };
        },
      );

      toast.success(`Le commentaire a été modifié avec succès`);
    },
    onError(error) {
      console.error(error);
      toast.error(`Échec de la modification du commentaire`);
    },
  });

  return mutation;
}
