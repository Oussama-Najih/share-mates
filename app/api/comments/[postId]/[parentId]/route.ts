import { prisma } from "@/db/prisma";
import { CommentsPage, getCommentDataInclude } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string; parentId: string }> },
) {
  try {
    const { postId, parentId } = await params;

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;

    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!postId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId, parentId: parentId === "root" ? null : parentId },
      include: getCommentDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const data: CommentsPage = {
      comments: comments.slice(0, pageSize),
      nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error(errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
