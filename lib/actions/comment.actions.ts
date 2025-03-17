"use server";

import { prisma } from "@/db/prisma";
import { getCommentDataInclude, PostData } from "@/index/prisma/types";
import { getServerUser } from "../serverFuncs";

export async function submitComment(data: {
  postId: string;
  parentId: string | null;
  message: string;
}) {
  const { postId, parentId, message } = data;

  const loggedInUser = await getServerUser();

  if (!loggedInUser) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  const parentComment = parentId
    ? await prisma.comment.findUnique({
        where: {
          id: parentId,
          postId,
        },
      })
    : null;

  if (!post) {
    throw new Error("Post not found");
  }

  const recipientId = parentComment ? parentComment.userId : post.authorId;

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        parentId,
        message,
        userId: loggedInUser.id,
        postId,
      },
      include: getCommentDataInclude(loggedInUser.id),
    }),
    ...(!(
      (loggedInUser.id === post.authorId && parentId === null) ||
      parentComment?.userId === loggedInUser.id
    )
      ? [
          prisma.notification.create({
            data: {
              issuerId: loggedInUser.id,
              recipientId,
              commentId: null, // This will be updated after transaction
              postId,
              type: parentId ? "REPLY" : "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  // Update the notification's commentId with the actual new comment ID
  if (newComment) {
    await prisma.notification.updateMany({
      where: {
        issuerId: loggedInUser.id,
        recipientId,
        postId,
        commentId: null,
      },
      data: {
        commentId: newComment.id,
      },
    });
  }

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
