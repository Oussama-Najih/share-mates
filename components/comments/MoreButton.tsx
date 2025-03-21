import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CommentData } from "@/index/prisma/types";
import DeleteDialog from "../posts/DeleteDialog";

interface PostMoreButtonProps {
  comment: CommentData;
  className?: string;
}

export default function MoreButton({
  comment,
  className,
}: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Edit size={18} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash size={18} className="hover:text-destructive" />
            <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Move DeleteDialog outside of the dropdown to prevent closure issues */}
      {showDeleteDialog && (
        <DeleteDialog
          comment={comment}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          message="Êtes-vous sûr de vouloir supprimer votre commentaire ?"
        />
      )}
    </>
  );
}
