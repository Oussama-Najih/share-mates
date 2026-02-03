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
  const getNotificationUrl = () => {
    const url = new URL(
      `/post/${
        notification.postId ? notification.postId : notification.comment?.postId
      }`,
      window.location.origin,
    );

    if (notification.commentId) {
      url.searchParams.set("commentId", notification.commentId);
    }

    return url.pathname + url.search;
  };

  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    REPLY: {
      message: `a répondu à votre commentaire`,
      icon: <Reply className="size-7 text-primary" />,
      href: getNotificationUrl(),
    },
    COMMENT: {
      message: `a commenté sur votre post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: getNotificationUrl(),
    },
    LIKE: {
      message: `a aimé votre ${notification.postId ? "post" : "commentaire"}`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: getNotificationUrl(),
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl p-5 shadow-sm transition-colors hover:bg-blue-200 group dark:hover:bg-slate-300",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar
            userId={notification.issuer.id}
            avatarUrl={notification.issuer.image}
            size={36}
          />
          <div className="dark:group-hover:text-slate-500">
            <span className="font-bold">{notification.issuer.name}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.type !== "LIKE" && notification.comment?.message && (
            <div className="line-clamp-3 dark:group-hover:text-primary-foreground whitespace-pre-line text-muted-foreground">
              {notification.comment.message}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
