"use server";

import { prisma } from "@/db/prisma";
import { getCommentDataInclude, PostData } from "@/index/prisma/types";
import { getServerUser } from "../serverFuncs";

export async function submitComment(data: {
  postId: string;
  parentId: string | null;
  message: string;
}) {
  console.log("submitCommentaction");
  const { postId, parentId, message } = data;

  const user = await getServerUser();

  if (!user) throw new Error("Unauthorized");

  const newComment = await prisma.comment.create({
    data: {
      parentId,
      message,
      userId: user.id,
      postId,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
}

export async function deleteComment(commentId: string) {
  const user = await getServerUser();

  if (!user) throw new Error("Unauthorized");

  const descendantsCount = await countAllChildren(commentId);

  const deletedComment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
    include: getCommentDataInclude(user.id),
  });

  return {
    deletedComment,
    descendantsCount,
  };
}

// Recursive function to count all descendants of a comment
async function countAllChildren(commentId: string): Promise<number> {
  const children = await prisma.comment.findMany({
    where: { parentId: commentId },
  });

  let count = children.length; // Start by counting the immediate children

  // Recursively count children of each child
  for (const child of children) {
    count += await countAllChildren(child.id);
  }

  return count;
}
