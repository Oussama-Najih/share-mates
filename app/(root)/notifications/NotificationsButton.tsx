"use client";

import { Button } from "@/components/ui/button";
import { NotificationCountInfo } from "@/index/prisma/types";
import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import Link from "next/link";

export interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({
  initialState,
}: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 10 * 1000,
  });

  return (
    <Button
      variant="outline"
      asChild
      className="bg-primary group py-3 rounded-md flex justify-center items-center"
    >
      <Link href="/notifications" className="text-primary-foreground">
        <div className="flex justify-center items-center gap-6">
          <p>Notifications</p>
          {/* Reduce the Bell icon size */}
          {/* <Bell
            size={18}
            className="scale-125 text-primary-foreground group-hover:text-primary"
          /> */}

          {/* Adjust notification badge size and centering */}
          {!!data.unreadCount && (
            <span className="group-hover:bg-primary group-hover:text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full bg-accent text-[10px] font-medium tabular-nums text-primary">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notifications</span>
      </Link>
    </Button>
  );
}
