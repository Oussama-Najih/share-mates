import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();
const utApi = new UTApi();

// Middleware to check authentication
const authMiddleware = async () => {
  const user = await getServerUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { user };
};

// Handler for attachments (PDF & IMAGE)
const handleAttachmentUpload =
  (type: "PDF" | "IMAGE") =>
  async ({ file }: { file: { ufsUrl: string; name: string } }) => {
    const media = await prisma.media.create({
      data: {
        url: file.ufsUrl,
        type,
        originalFileName:
          type === "PDF"
            ? file.name.split("/^_/")[0] ?? "unknown.pdf"
            : undefined,
      },
    });
    return { mediaId: media.id };
  };

export const fileRouter = {
  avatar: f({ image: { maxFileSize: "512KB" } })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.image;
      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(`/f/`)[1];
        await utApi.deleteFiles(key);
      }

      const newAvatarUrl = file.ufsUrl;
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { image: newAvatarUrl },
      });

      return { avatarUrl: newAvatarUrl };
    }),

  attachment_pdf: f({ pdf: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(authMiddleware)
    .onUploadComplete(handleAttachmentUpload("PDF")),

  attachment_image: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(authMiddleware)
    .onUploadComplete(handleAttachmentUpload("IMAGE")),
  attachment_single_image: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authMiddleware)
    .onUploadComplete(handleAttachmentUpload("IMAGE")),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
