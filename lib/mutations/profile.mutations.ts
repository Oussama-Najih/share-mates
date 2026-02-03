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
import { updateProfileType } from "@/index/validationTypes/types";
import { updateUserProfile } from "../actions/user.actions";

export function useUpdateAvatarMutation(userId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async (avatar: File) => {
      const uploadResult = await startAvatarUpload([avatar]);

      if (!uploadResult || uploadResult.length === 0) {
        throw new Error("Upload failed");
      }

      return uploadResult[0].serverData.avatarUrl;
    },
    onSuccess: async (newAvatarUrl) => {
      try {
        queryClient.invalidateQueries({
          queryKey: [`user-avatar-${userId}`],
        });
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

export function useUpdateProfileMutation(
  userId: string,
  setError: (
    name: keyof updateProfileType,
    error: { type?: string; message: string },
  ) => void,
  onOpenChange: (value: boolean) => void,
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ value }: { value: updateProfileType }) => {
      return updateUserProfile(value);
    },
    onSuccess: async (updatedUser) => {
      try {
        if (!updatedUser) {
          setError("name", {
            type: "manual",
            message:
              "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
          });
          return;
        }

        const queryFilter: QueryFilters<
          InfiniteData<PostsPage, string | null>
        > = {
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
                posts: page.posts.map((post) => {
                  if (post.authorId === userId) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                      },
                    };
                  }
                  return post;
                }),
              })),
            };
          },
        );

        await queryClient.invalidateQueries({
          queryKey: ["matieres", "user-posts"],
        });

        router.refresh();
        onOpenChange(false);
        toast.success("Profil actualisé avec succès");
      } catch (error) {
        toast.error("Échec de la mise à jour du profil. Veuillez réessayer.");
      }
    },
    onError(error: any) {
      console.error(error);
      const errorMessage =
        error?.message ||
        "Échec de la mise à jour du profil. Veuillez réessayer.";
      toast.error(errorMessage);
    },
  });

  return mutation;
}
