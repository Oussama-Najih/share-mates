"use server";

import { prisma } from "@/db/prisma";
import { getServerUser } from "../serverFuncs";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      media: {
        select: { url: true },
      },
    },
  });
}

export async function createAnnouncement(data: {
  title: string;
  mediaId?: string;
}) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.announcement.create({
      data: {
        title: data.title,
        media: data.mediaId ? { connect: { id: data.mediaId } } : undefined, // Fix mediaId issue
        authorId: user.id,
      },
    });

    revalidatePath("/");
    return { message: "Annonce créé avec succès", success: true };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { message: "La création de l'annonce a échoué", success: false };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.announcement.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    return { message: "Annonce supprimée avec succès", success: true };
  } catch (error) {
    console.error("Error creating announcement:", error);
    return { message: "La suppression de l'annonce a échoué", success: false };
  }
}
