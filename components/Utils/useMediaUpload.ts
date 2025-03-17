import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";
import toast from "react-hot-toast";

export interface Attachment {
  file: File; //We get the file immediately
  mediaId?: string; //Optional because we only get it after the upload is finished
  isUploading: boolean;
}

export default function useMediaUpload(
  mediaType: "attachment_image" | "attachment_pdf"
) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing(mediaType, {
    //When we get a mediaId back, we can identify the corresponding file
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          }
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);
      return renamedFiles;
      //The return renamedFiles; inside onBeforeUploadBegin(files) is received by the useUploadThing hook.
      // Specifically, useUploadThing internally uses this return value as the new list of files to upload. Instead of uploading the original files array, it uploads renamedFiles (which contains the same file data but with new names).
    },
    onUploadProgress: setUploadProgress,
    // The `res` parameter in `onClientUploadComplete(res)` comes from the `startUpload` function provided by `useUploadThing`.
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;
          //return to frontend
          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        })
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast.error(e.message);
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Veuillez attendre la fin du téléchargement en cours.");
    }

    if (attachments.length && files.length > 5) {
      toast.error(
        "Vous ne pouvez télécharger qu'un seul fichier joint par publication."
      );
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    setAttachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
