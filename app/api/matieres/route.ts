import { prisma } from "@/db/prisma";
import { getPostDataInclude, PostsPage } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";
import { Categorie, MediaType, Prisma, Subject } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const matiere = searchParams.get("matiere") as keyof typeof Subject | null;
    const option = searchParams.get("option") || null;
    const mediaType = searchParams.get("type_Media") as
      | keyof typeof MediaType
      | null;
    const categorie = searchParams.get("categorie") as
      | keyof typeof Categorie
      | null;

    const pageSize = 10;
    const user = await getServerUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filters: Prisma.PostWhereInput = {
      ...(matiere ? { subject: matiere as Subject } : {}),
      ...(categorie ? { category: categorie as Categorie } : {}),
      ...(option ? { correction: option === "CORRECTIONS" } : {}),
      ...(mediaType
        ? {
            attachment: {
              some: { type: mediaType as MediaType },
            },
          }
        : {}),
    };

    const posts = await prisma.post.findMany({
      where: filters,
      include: getPostDataInclude(),
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
