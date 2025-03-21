"use client";

import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user/UserAvatar";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { UserData } from "@/index/prisma/types";
import EditAvatarDialog from "./EditAvatarDialog";
import MainEdit from "./MainEdit";

interface UserProfileProps {
  detailedLoggedInUser: UserData;
}

export default function UserProfile({
  detailedLoggedInUser,
}: UserProfileProps) {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [showMainDialog, setShowMainDialog] = useState(false);

  return (
    <div className="h-fit w-full space-y-10 rounded-2xl bg-card p-5 shadow-sm">
      {/* Removed asChild to properly trigger onClick */}
      <button
        onClick={() => setShowAvatarDialog(true)}
        className="block mx-auto"
      >
        <UserAvatar
          avatarUrl={detailedLoggedInUser.image}
          size={250}
          className="size-full hover:opacity-70 transition-colors duration-300 max-h-60 max-w-60 rounded-full"
          canEdit={true}
        />
      </button>

      <EditAvatarDialog
        user={detailedLoggedInUser}
        open={showAvatarDialog}
        onOpenChange={setShowAvatarDialog}
      />

      <Button
        variant="default"
        onClick={() => setShowMainDialog(true)}
        className="block mx-auto"
      >
        Mettre à jour vos informations
      </Button>
      <MainEdit
        user={detailedLoggedInUser}
        open={showMainDialog}
        onOpenChange={setShowMainDialog}
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
            <span>
              Announcements:{" "}
              <span className="font-semibold">
                {formatNumber(detailedLoggedInUser._count.announcements)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
