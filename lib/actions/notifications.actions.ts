"use server";

import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";

export const markNotificationsAsRead = async () => {
  try {
    const user = await getServerUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
