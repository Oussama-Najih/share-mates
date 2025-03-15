"use client";

import toast from "react-hot-toast";
import useMediaUpload from "../Utils/useMediaUpload";
import { UploadButton } from "@/lib/uploadthing";
import { AttachmentPreviews } from "../Utils/PostEditor";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AnnouncementImageUploader({
  setMediaId,
}: {
  setMediaId: (id: string) => void;
}) {
  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
  } = useMediaUpload("attachment_image");

  function handleFileSelection(files: File[]) {
    if (attachments.length >= 1) {
      toast.error("Une seule image est autorisée.");

      return;
    }
    startUpload(files);
  }

  // Set mediaId when attachments change
  useEffect(() => {
    if (attachments.length > 0) {
      setMediaId(attachments[0].mediaId!); // Assuming `id` exists in attachment
    }
  }, [attachments, setMediaId]);

  return (
    <div className="flex flex-col items-center gap-4 border p-4 rounded-lg">
      <h2 className="text-lg font-semibold">Upload Announcement Image</h2>
      <UploadButton
        endpoint="attachment_image"
        onChange={handleFileSelection}
        disabled={attachments.length >= 1 || isUploading}
        appearance={{
          button:
            "text-black dark:text-primary mb-2 border-blue-200 dark:border-blue-300 border-2 hover:cursor-pointer",
        }}
      />
      {isUploading && (
        <>
          <span className="text-sm">{uploadProgress ?? 0}%</span>
          <Loader2 className="size-5 animate-spin text-primary" />
        </>
      )}
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
          afterRemoveAttachment={setMediaId}
        />
      )}
    </div>
  );
}
