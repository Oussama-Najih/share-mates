import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;
    const commentsCount = await prisma.comment.count({
      where: { parentId: commentId },
    });
    return NextResponse.json(commentsCount);
  } catch (error) {
    console.error("Error fetching comments count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
