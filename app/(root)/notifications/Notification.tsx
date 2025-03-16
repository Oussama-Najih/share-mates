import UserAvatar from "@/components/user/UserAvatar";
import { NotificationData } from "@/index/prisma/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, Reply } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  console.log({ notification });

  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    REPLY: {
      message: `${notification.issuer.name} replied to your comment`,
      icon: <Reply className="size-7 text-primary" />,
      href: `/post/${notification.postId}`,
    },
    COMMENT: {
      message: `${notification.issuer.name} commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/post/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.name} liked your ${
        notification.postId ? "post" : "comment"
      }`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/post/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl p-5 shadow-sm transition-colors hover:bg-blue-200 group dark:hover:bg-slate-300",
          !notification.read && "bg-primary/10"
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.image} size={36} />
          <div className="dark:group-hover:text-slate-500">
            <span className="font-bold">{notification.issuer.name}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.type != "LIKE" && (
            <div className="line-clamp-3 dark:group-hover:text-primary-foreground whitespace-pre-line text-muted-foreground">
              {notification.comment?.message}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
