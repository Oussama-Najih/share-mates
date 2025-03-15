import { MoreHorizontal, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AnnouncementData, PostData } from "@/index/prisma/types";
import DeleteDialog from "./DeleteDialog";

interface DeleteButtonProps {
  post?: PostData;
  announcement?: AnnouncementData;
  className?: string;
}

export default function DeleteButton({
  post,
  announcement,
  className,
}: DeleteButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const props = post ? { post } : { announcement };

  return (
    <>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      <button onClick={() => setShowDeleteDialog(true)}>
        <Trash size={18} className="hover:text-destructive" />
      </button>
      <DeleteDialog
        {...props}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        message={`Êtes-vous sur de vouloir supprimer ${
          post ? "ce post" : " cette annonce"
        }`}
      />
    </>
  );
}
