import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";
import { MediaType } from "@prisma/client";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const user = await getServerUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.image;

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(`/f/`)[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatarUrl = file.ufsUrl;

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          image: newAvatarUrl,
        },
      });

      return { avatarUrl: newAvatarUrl };
    }),
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      console.log("middleware uplaod");
      const user = await getServerUser();
      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log({ file });
      console.log("oncomplete");

      const media = await prisma.media.create({
        data: {
          url: file.ufsUrl,
          type: "IMAGE" as keyof typeof MediaType,
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
