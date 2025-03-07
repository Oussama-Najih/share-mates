import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "../actions/post.actions";
import { useSession } from "next-auth/react";
import { PostsPage } from "@/index/prisma/types";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();
  const { data } = useSession();

  if (!data) {
    throw new Error("Unauthorized");
  }

  const searchParams = useSearchParams();
  const matiere = searchParams.get("matiere");
  const categorie = searchParams.get("categorie");

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["matieres"],
          predicate(query) {
            return (
              query.queryKey.length === 1 ||
              (query.queryKey.includes(matiere) &&
                query.queryKey.includes(categorie)) ||
              (query.queryKey.includes(matiere) &&
                query.queryKey.length === 2) ||
              (query.queryKey.includes(categorie) &&
                query.queryKey.length === 2)
            );
          },
        };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) {
            return {
              pageParams: [],
              pages: [{ posts: [newPost], nextCursor: null }],
            };
          }

          const firstPage = oldData.pages[0];

          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newPost, ...(firstPage?.posts || [])],
                nextCursor: firstPage?.nextCursor || null,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError() {
      toast.error("Failed to post. Please try again.");
    },
  });

  return mutation;
}
