"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { NotificationsButtonProps } from "@/app/(root)/notifications/NotificationsButton";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/index/prisma/types";

export default function ButtonWithNotisCount({
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
    <Button variant="outline" className="relative w-16 p-2">
      <Menu size={24} />
      {/* Notification Count */}
      {!!data.unreadCount && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium tabular-nums">
          {data.unreadCount}
        </span>
      )}
    </Button>
  );
}
