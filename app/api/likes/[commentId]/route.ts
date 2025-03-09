import { prisma } from "@/db/prisma";
import { LikeInfo } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const loggedInUser = await getServerUser();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!comment) {
      return Response.json({ error: "Comment not found" }, { status: 404 });
    }

    const data: LikeInfo = {
      likes: comment._count.likes,
      isLikedByUser: !!comment.likes.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const loggedInUser = await getServerUser();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const like = await prisma.like.upsert({
      where: {
        userId_commentId: {
          userId: loggedInUser.id,
          commentId,
        },
      },
      create: {
        userId: loggedInUser.id,
        commentId,
      },
      update: {},
    });

    console.log({ like });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    const loggedInUser = await getServerUser();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        userId: true,
      },
    });

    if (!comment) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.like.deleteMany({
      where: {
        userId: loggedInUser.id,
        commentId,
      },
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
