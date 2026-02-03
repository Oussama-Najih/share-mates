import {
  InfiniteData,
  Query,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, submitPost, updatePost } from "../actions/post.actions";
import { useSession } from "next-auth/react";
import { PostsPage } from "@/index/prisma/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const option = searchParams.get("option");
  const mediaType = searchParams.get("type_Media");

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["matieres"],
          predicate(query) {
            const qk = query.queryKey;

            const includesMatiere = matiere && qk.includes(matiere);
            const includesCategorie = categorie && qk.includes(categorie);
            const includesOption = option && qk.includes(option);
            const includesMediaType = mediaType && qk.includes(mediaType);

            if (qk.length === 1) return true;

            if (
              (includesMatiere ||
                includesCategorie ||
                includesOption ||
                includesMediaType) &&
              qk.length === 2
            ) {
              return true;
            }

            if (
              ((includesMatiere && includesCategorie) ||
                (includesMatiere && includesOption) ||
                (includesMatiere && includesMediaType) ||
                (includesCategorie && includesOption) ||
                (includesCategorie && includesMediaType) ||
                (includesOption && includesMediaType)) &&
              qk.length === 3
            ) {
              return true;
            }

            if (
              ((includesMatiere && includesCategorie && includesOption) ||
                (includesMatiere && includesCategorie && includesMediaType) ||
                (includesMatiere && includesOption && includesMediaType) ||
                (includesCategorie && includesOption && includesMediaType)) &&
              qk.length === 4
            ) {
              return true;
            }

            if (
              includesMatiere &&
              includesCategorie &&
              includesOption &&
              includesMediaType &&
              qk.length === 5
            ) {
              return true;
            }

            return false;
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
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate
            ? queryFilter.predicate(
                query as Query<
                  InfiniteData<PostsPage, string | null>,
                  Error,
                  InfiniteData<PostsPage, string | null>,
                  readonly unknown[]
                >,
              ) && !query.state.data
            : false;
        },
      });

      toast.success("Post créé avec succès");
    },
    onError() {
      toast.error("La création du post a échoué. Veuillez réessayer.");
    },
  });

  return mutation;
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["matieres"],
        };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );

      toast.success("Post supprimé avec succès");

      if (pathname === `/post/${deletedPost.id}`) {
        router.push("/profil");
      }
    },
    onError(error) {
      console.error(error);
      toast.error("Échec de la suppression du post. Veuillez réessayer.");
    },
  });

  return mutation;
}

export function useUpdatePostMutation(isTitle = false) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: async (updatedPost) => {
      const queryFilter: QueryFilters<InfiniteData<PostsPage, string | null>> =
        {
          queryKey: ["matieres"],
        };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            })),
          };
        },
      );

      toast.success(
        `${isTitle ? "Le titre" : "La description"} a été modifié avec succès`,
      );
    },
    onError(error) {
      console.error(error);
      toast.error(
        `Échec de la modification ${
          isTitle ? "du titre" : "de la description du post"
        }. Veuillez réessayer.`,
      );
    },
  });

  return mutation;
}
