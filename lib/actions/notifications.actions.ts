"use server";

import { prisma } from "@/db/prisma";
import { getServerUser } from "@/lib/serverFuncs";

// Action for marking notifications as read
export const markNotificationsAsRead = async () => {
  try {
    // Get the logged-in user
    const user = await getServerUser();

    // Check if the user is authenticated
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Mark notifications as read
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
