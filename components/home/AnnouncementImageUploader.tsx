"use client";

import toast from "react-hot-toast";
import useMediaUpload from "../Utils/useMediaUpload";
import { UploadButton } from "@/lib/uploadthing";
import { AttachmentPreviews } from "../Utils/PostEditor";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useDropzone } from "@uploadthing/react";

export default function AnnouncementImageUploader({
  title,
  setTitle,
  setMediaId,
}: {
  title: string;
  setTitle: (value: string) => void;
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
    if (attachments.length >= 5) {
      toast.error("5 images au maximum sont autorisées");

      return;
    }
    startUpload(files);

    // Automatically set the title for PDFs if the title is still empty
    // if (files.length > 0 && title.trim() === "") {
    //   const fileName = files[0].name.replace(/\.[^/.]+$/, ""); // Remove file extension
    //   setTitle(fileName);
    // }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelection,
  });

  // Don't want to trigger file input onClick
  const { onClick, ...rootProps } = getRootProps();

  // Set mediaId when attachments change
  useEffect(() => {
    if (attachments.length > 0) {
      setMediaId(attachments[0].mediaId!); // Assuming `id` exists in attachment
    }
  }, [attachments, setMediaId]);

  return (
    <div
      {...rootProps}
      className={`flex flex-col items-center  gap-4 border p-4 rounded-lg ${
        isDragActive ? "outline-dashed outline-blue-300" : ""
      }`}
    >
      <h2 className="text-lg font-semibold">Upload Announcement Image</h2>
      {/* hidden is included in getInputProps */}
      <input {...getInputProps()} />
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
          afterRemoveAttachment2={setTitle}
        />
      )}
    </div>
  );
}
