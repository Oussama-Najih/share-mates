"use client";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user/UserAvatar";
import EditProfileDialog from "./EditProfileDialog";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { UserData } from "@/index/prisma/types";

interface UserProfileProps {
  detailedLoggedInUser: UserData;
}

export default function UserProfile({
  detailedLoggedInUser,
}: UserProfileProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      {/* Removed asChild to properly trigger onClick */}
      <button onClick={() => setShowDialog(true)} className="block mx-auto">
        <UserAvatar
          avatarUrl={detailedLoggedInUser.image}
          size={250}
          className="size-full hover:opacity-70 transition-colors duration-300 max-h-60 max-w-60 rounded-full"
          canEdit={true}
        />
      </button>

      <EditProfileDialog
        user={detailedLoggedInUser}
        open={showDialog}
        onOpenChange={setShowDialog}
      />

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="mx-auto flex flex-col items-center space-y-3">
          <h1 className="text-3xl font-bold">{detailedLoggedInUser.name}</h1>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(detailedLoggedInUser._count.posts)}
              </span>
            </span>
            <span>
              Comments:{" "}
              <span className="font-semibold">
                {formatNumber(detailedLoggedInUser._count.comments)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
