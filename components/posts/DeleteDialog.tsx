import { AnnouncementData, CommentData, PostData } from "@/index/prisma/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../form/LoadingButton";
import { useDeletePostMutation } from "@/lib/mutations/post.mutations";
import { useTransition } from "react";
import { deleteAnnouncement } from "@/lib/actions/announcements.actions";
import toast from "react-hot-toast";
import { useDeleteCommentMutation } from "@/lib/mutations/comment.mutations";

interface DeleteDialogProps {
  post?: PostData;
  announcement?: AnnouncementData;
  comment?: CommentData;
  message?: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteDialog({
  post,
  announcement,
  comment,
  message,
  open,
  onClose,
}: DeleteDialogProps) {
  const { mutate: mutateP, isPending: isPendingP } = useDeletePostMutation();
  const { mutate: mutateC, isPending: isPendingC } = useDeleteCommentMutation();
  const [isUpdating, startTransition] = useTransition();

  function handleDelete() {
    if (post) {
      mutateP(post.id, { onSuccess: onClose });
    } else if (comment) {
      mutateC(comment.id, { onSuccess: onClose });
    } else if (announcement) {
      startTransition(async () => {
        const res = await deleteAnnouncement(announcement.id);

        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        onClose();
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Supprimer{" "}
            {post
              ? "votre post"
              : announcement
              ? "cette annonce"
              : "votre commentaire"}
          </DialogTitle>
          <DialogDescription>
            {message ||
              "Êtes-vous sûr de vouloir supprimer ceci ? Cette action est irréversible."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end space-x-2">
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPendingP || isPendingC || isUpdating}
            disabled={isPendingP || isPendingC || isUpdating}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPendingP || isPendingC || isUpdating}
            autoFocus
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
