import { Trash } from "lucide-react";
import { useState } from "react";
import { AnnouncementData, CommentData, PostData } from "@/index/prisma/types";
import DeleteDialog from "./DeleteDialog";

interface DeleteButtonProps {
  post?: PostData;
  announcement?: AnnouncementData;
  comment?: CommentData;
  className?: string;
}

export default function DeleteButton({
  post,
  announcement,
  comment,
  className,
}: DeleteButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const props = post ? { post } : announcement ? { announcement } : { comment };

  return (
    <>
      <button onClick={() => setShowDeleteDialog(true)}>
        <Trash size={18} className="hover:text-destructive" />
      </button>
      <DeleteDialog
        {...props}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        message={`Êtes-vous sur de vouloir supprimer ${
          post ? "ce post" : announcement ? " cette annonce" : "ce commentaire"
        }`}
      />
    </>
  );
}
