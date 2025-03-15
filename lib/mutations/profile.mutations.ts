import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { PostsPage } from "@/index/prisma/types";
import toast from "react-hot-toast";

export function useUpdateAvatarMutation(userId: string) {
  console.log("useUpdateProfileMutation");

  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (avatar: File) => {
      const uploadResult = await startAvatarUpload([avatar]);

      if (!uploadResult || uploadResult.length === 0) {
        throw new Error("Upload failed");
      }

      return uploadResult[0].serverData.avatarUrl; // Extract avatar URL directly
    },
    onSuccess: async (newAvatarUrl) => {
      try {
        const queryFilter: QueryFilters<
          InfiniteData<PostsPage, string | null>
        > = {
          queryKey: ["matieres"],
        };

        await queryClient.cancelQueries(queryFilter);

        queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
          queryFilter,
          (oldData) => {
            if (!oldData) return oldData;

            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  if (post.author.id === userId) {
                    return {
                      ...post,
                      author: {
                        ...post.author,
                        image: newAvatarUrl || post.author.image,
                      },
                    };
                  }
                  return post;
                }),
              })),
            };
          }
        );

        router.refresh();
        toast.success("Avatar actualisé avec succès");
        return newAvatarUrl;
      } catch (error) {
        console.error(error);
        toast.error("Échec de la mise à jour du profil. Veuillez réessayer.");
      }
    },
    onError(error) {
      console.error(error);
      toast.error("Échec de la mise à jour du profil. Veuillez réessayer.");
    },
  });

  return mutation;
}
