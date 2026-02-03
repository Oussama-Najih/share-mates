"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserData } from "@/index/prisma/types";
import { useUpdateAvatarMutation } from "@/lib/mutations/profile.mutations";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "./CropImageDialog";
import { useQueryClient } from "@tanstack/react-query";

interface EditAvatarDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditAvatarDialog({
  userId,
  open,
  onOpenChange,
}: EditAvatarDialogProps) {
  const queryClient = useQueryClient();

  const avatarUrl = queryClient.getQueryData<{ avatar: string | null }>([
    `user-avatar-${userId}`,
  ])?.avatar;

  const mutation = useUpdateAvatarMutation(userId);
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setPreviewUrl("");
      setCroppedAvatar(null);
    }
  }, [open]);

  useEffect(() => {
    if (croppedAvatar) {
      const objectUrl = URL.createObjectURL(croppedAvatar);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl("");
    }
  }, [croppedAvatar]);

  async function onSubmit() {
    if (!croppedAvatar) return;

    const newAvatarFile = new File([croppedAvatar], `avatar_${userId}.webp`, {
      type: "image/webp",
    });

    mutation.mutate(newAvatarFile, {
      onSuccess: async () => {
        setCroppedAvatar(null);
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Avatar</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={previewUrl || avatarUrl || "/images/avatar-placeholder.png"}
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="ml-3"
            onClick={onSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
}

function AvatarInput({ src, onImageCropped }: AvatarInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onImageSelected(image: File | undefined) {
    if (!image) return;

    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar preview"
          width={250}
          height={250}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
}
