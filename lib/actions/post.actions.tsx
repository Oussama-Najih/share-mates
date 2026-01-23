"use server";

import { createPostSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { getPostDataInclude } from "@/index/prisma/types";
import { getServerUser } from "../serverFuncs";
import { Subject, Categorie } from "@prisma/client"; // ✅ Import Enums from Prisma

export async function submitPost(data: {
  matiere: string;
  categorie: string;
  title: string;
  content?: string;
  mediaIds: string[];
  option: string;
}) {
  const { mediaIds: m } = data;
  if (!m || m.length === 0) {
    throw new Error("No media IDs provided");
  }

  const user = await getServerUser();
  if (!user) throw new Error("Unauthorized");

  const { categorie, matiere, ...rest } = data;

  // Validate and map to Prisma Enum safely
  if (!Object.values(Subject).includes(matiere as Subject)) {
    throw new Error(`Matiere invalide: ${matiere}`);
  }
  if (!Object.values(Categorie).includes(categorie as Categorie)) {
    throw new Error(`categorie invalide: ${categorie}`);
  }

  const subject = matiere as Subject;
  const category = categorie as Categorie;

  const { title, content, mediaIds, option } = createPostSchema.parse(rest);

  // console.log({
  //   subject, // ✅ Now correctly mapped to the Subject enum
  //   category, // ✅ Now correctly mapped to the Categorie enum
  //   title,
  //   content,
  //   correction: option === "CORRECTIONS", // ✅ Simplified condition
  //   authorId: user.id,
  // });

  const newPost = await prisma.post.create({
    data: {
      subject, // ✅ Now correctly mapped to the Subject enum
      category, // ✅ Now correctly mapped to the Categorie enum
      title,
      content,
      authorId: user.id,
      attachment: {
        connect: mediaIds.map((id) => ({ id })), // Connect multiple media items if mediaId is an array
      },
      correction: option === "CORRECTIONS", // ✅ Simplified condition
    },
    include: getPostDataInclude(),
  });

  return newPost;
}

export async function deletePost(id: string) {
  const user = await getServerUser();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");

  if (post.authorId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(),
  });

  return deletedPost;
}

export async function updatePost({
  postId,
  isTitle = true,
  value,
}: {
  postId: string;
  isTitle: boolean;
  value: string;
}) {
  const user = await getServerUser();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) throw new Error("Post not found");

  if (post.authorId !== user.id) throw new Error("Unauthorized");

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      [isTitle ? "title" : "content"]: value, // Conditional key assignment
    },
    include: getPostDataInclude(),
  });

  return updatedPost;
}
