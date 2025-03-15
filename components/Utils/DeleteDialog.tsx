import { AnnouncementData, PostData } from "@/index/prisma/types";
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

interface DeleteDialogProps {
  post?: PostData;
  announcement?: AnnouncementData;
  message?: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteDialog({
  post,
  announcement,
  message,
  open,
  onClose,
}: DeleteDialogProps) {
  const mutation = useDeletePostMutation();
  const [isUpdating, startTransition] = useTransition();

  function handleDelete() {
    if (post) {
      mutation.mutate(post.id, { onSuccess: onClose });
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
            Supprimer {post ? "ce post" : "cette annonce"}?
          </DialogTitle>
          <DialogDescription>
            {message ||
              "Are you sure you want to delete this? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end space-x-2">
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={mutation.isPending || isUpdating}
            disabled={mutation.isPending || isUpdating}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending || isUpdating}
            autoFocus
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
