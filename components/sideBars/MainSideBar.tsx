"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { lowerCaseFirstLetter } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { NotificationCountInfo } from "@/index/prisma/types";

const sideBarOptions = [
  "Accueil",
  "Matières",
  "Notifications",
  // "Controles",
  // "Examens",
  // "TDs",
  // "TPs",
];

export default function MainSideBar({
  unreadNotificationCount,
}: {
  unreadNotificationCount: number;
}) {
  const { data } = useQuery({
    queryKey: ["unread-notification-count"],
    queryFn: () =>
      kyInstance
        .get("/api/notifications/unread-count")
        .json<NotificationCountInfo>(),
    initialData: { unreadCount: unreadNotificationCount },
    refetchInterval: 10 * 1000,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative w-16 p-2">
          <Menu size={24} />
          {/* Notification Count */}
          {!!data.unreadCount && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium tabular-nums">
              {data.unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="font-bold">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-8 font-roboto flex flex-col space-y-8">
          {sideBarOptions.map((option) =>
            !(option === "Notifications") ? (
              <Button
                key={option} // <-- Added key here
                variant="outline"
                asChild
                className="bg-primary py-3 rounded-md flex justify-center items-center "
              >
                <Link
                  href={`/${
                    option === "Accueil"
                      ? ""
                      : option === "Matières"
                      ? "matieres"
                      : lowerCaseFirstLetter(option)
                  }`}
                  className="text-primary-foreground"
                >
                  {option}
                </Link>
              </Button>
            ) : (
              <Button
                key={option} // <-- Added key here
                variant="outline"
                asChild
                className="bg-primary group py-3 rounded-md flex justify-center items-center"
              >
                <Link href="/notifications" className="text-primary-foreground">
                  <div className="flex justify-center items-center gap-6">
                    <p>Notifications</p>
                    {/* Notification badge */}
                    {!!data.unreadCount && (
                      <span className="group-hover:bg-primary group-hover:text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full bg-accent text-[10px] font-medium tabular-nums text-primary">
                        {data.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              </Button>
            )
          )}
          {/* <Button
            key="profil" // <-- Added key here
            variant="outline"
            asChild
            className="flex bg-primary group py-3 rounded-md sm:hidden justify-center items-center"
          >
            <Link
              href="/profil"
              className="text-primary-foreground text-center"
            >
              <p>Profil</p>
            </Link>
          </Button> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
