import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    const avatarUrl = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    console.log("Avatar URL:", avatarUrl);

    return NextResponse.json({ avatar: avatarUrl?.image || null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
