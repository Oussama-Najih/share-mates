import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    name: true,
    image: true,
    createdAt: true,
    _count: {
      select: {
        posts: true,
        comments: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    author: {
      select: getUserDataSelect(loggedInUserId), // ✅ Fix here
    },
    attachment: true,
    comments: true,
    likes: true,
  } satisfies Prisma.PostInclude;
}

export function getCommentDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    children: true,
    likes: true,
  } satisfies Prisma.CommentInclude;
}

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface CommentsPage {
  comments: CommentData[];
  nextCursor: string | null;
}

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export const notificationsInclude = {
  issuer: {
    select: {
      name: true,
      image: true,
    },
  },
  comment: {
    select: {
      message: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export const AnnouncementsInclude = {
  media: {
    select: { url: true },
  },
} satisfies Prisma.AnnouncementInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export type AnnouncementData = Prisma.AnnouncementGetPayload<{
  include: typeof AnnouncementsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
