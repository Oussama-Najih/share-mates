"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface UserAvatarProps {
  userId?: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  canEdit?: boolean;
  isInComment?: boolean;
}

export default function UserAvatar({
  userId,
  avatarUrl,
  size,
  className,
  canEdit = false,
  isInComment = false,
}: UserAvatarProps) {
  const avatarQueryKey: QueryKey = [`user-avatar-${userId}`];

  const apiUrl = `/api/avatar/${userId}`;

  const { data } = useQuery({
    queryKey: avatarQueryKey,
    queryFn: () =>
      kyInstance
        .get(apiUrl, userId ? { searchParams: { userId } } : undefined)
        .json<{ avatar: string | null }>(),
    initialData: { avatar: avatarUrl || null },
  });

  return (
    <div className={cn("relative group", isInComment && "hidden sm:block")}>
      {" "}
      <Image
        src={data?.avatar || "/images/avatar-placeHolder.png"}
        alt="User avatar"
        width={size ?? 42}
        height={size ?? 42}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
          className,
        )}
      />
      {/* Conditional rendering of the pencil icon inside the image */}
      {canEdit && (
        <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md group-hover:opacity-100 transition-opacity duration-300">
          <Pencil size={18} className="text-primary dark:text-secondary" />
        </div>
      )}
    </div>
  );
}
