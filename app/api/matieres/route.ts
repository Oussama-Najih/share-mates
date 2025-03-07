import { prisma } from "@/db/prisma";
import { getPostDataInclude, PostsPage } from "@/index/prisma/types";
import { getServerUser } from "@/lib/hooks";
import { Categorie, Prisma, Subject } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const matiere = searchParams.get("matiere") as keyof typeof Subject | null;
    const categorie = searchParams.get("categorie") as
      | keyof typeof Categorie
      | null;

    const pageSize = 10;
    const user = await getServerUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate and construct filters
    const filters: Prisma.PostWhereInput = {
      ...(matiere ? { subject: matiere as Subject } : {}),
      ...(categorie ? { category: categorie as Categorie } : {}),
    };

    const posts = await prisma.post.findMany({
      where: filters,
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
