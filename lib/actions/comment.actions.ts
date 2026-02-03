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
      include: getCommentDataInclude(),
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
              commentId: null,
              postId,
              type: parentId ? "REPLY" : "COMMENT",
            },
          }),
        ]
      : []),
  ]);

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
    include: getCommentDataInclude(),
  });

  return {
    deletedComment,
    descendantsCount,
  };
}

async function countAllChildren(commentId: string): Promise<number> {
  const children = await prisma.comment.findMany({
    where: { parentId: commentId },
  });

  let count = children.length;

  for (const child of children) {
    count += await countAllChildren(child.id);
  }

  return count;
}

export async function updateComment({
  id,
  content,
}: {
  id: string;
  content: string;
}) {
  const user = await getServerUser();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Post not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const updatedComment = await prisma.comment.update({
    where: { id },
    data: {
      message: content,
    },
    include: getCommentDataInclude(),
  });

  return updatedComment;
}
