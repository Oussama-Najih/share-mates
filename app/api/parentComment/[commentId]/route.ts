import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> },
) {
  try {
    const { commentId } = await params;

    const parentId = await prisma.comment
      .findUnique({
        where: { id: commentId },
        select: { parentId: true },
      })
      .then((comment) => comment?.parentId || null);
    return NextResponse.json(parentId);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
