"use server";

import { createPostSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { getPostDataInclude } from "@/index/prisma/types";
import { getServerUser } from "../hooks";
import { Subject, Categorie } from "@prisma/client"; // ✅ Import Enums from Prisma

export async function submitPost(data: {
  matiere: string;
  categorie: string;
  title: string;
  content?: string;
  mediaId: string;
}) {
  console.log({ data });
  const user = await getServerUser();
  if (!user) throw new Error("Unauthorized");

  const { categorie, matiere, ...rest } = data;

  // Convert raw string to Prisma Enum
  const subject = matiere as Subject;
  const category = categorie as Categorie;

  // Ensure they match valid enum values
  if (!Object.values(Subject).includes(subject)) {
    throw new Error(`Invalid subject: ${data.matiere}`);
  }
  if (!Object.values(Categorie).includes(category)) {
    throw new Error(`Invalid category: ${data.categorie}`);
  }

  const { title, content, mediaId } = createPostSchema.parse(rest);

  const newPost = await prisma.post.create({
    data: {
      subject, // ✅ Now correctly mapped to the Subject enum
      category, // ✅ Now correctly mapped to the Categorie enum
      title,
      content,
      authorId: user.id,
      attachment: {
        connect: { id: mediaId },
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
