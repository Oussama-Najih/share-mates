"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { FileText, ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useRef, useState } from "react";
import "./postEditor.css";
import LoadingButton from "../form/LoadingButton";
import { useSession } from "next-auth/react";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { TextField } from "@mui/material";
import { sx2, sx3 } from "@/CSS_Configs/mui";
import { useSubmitPostMutation } from "@/lib/mutations/post.mutations";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

import { Input } from "../ui/input";

export default function PostEditor({ isPdf = false }: { isPdf?: boolean }) {
  const { theme } = useTheme();

  const [title, setTitle] = useState("");

  const searchParams = useSearchParams();
  const matiere = searchParams.get("matiere") as string;
  const categorie = searchParams.get("categorie") as string;
  const option = searchParams.get("option") as string;

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    setAttachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload(`${isPdf ? "attachment_pdf" : "attachment_image"}`);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelection,
  });

  //Don't want to trigger file input onClick
  const { onClick, ...rootProps } = getRootProps();

  const canSubmit = title.length >= 2 && !!attachments.length;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Ajoutez une description !!",
      }),
    ],
    immediatelyRender: false, // ✅ Fix hydration mismatch
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    if (!attachments || !attachments.length) {
      console.error("No attachments provided");
      return; // Handle the error or return early
    }

    const payload = {
      matiere,
      categorie,
      title,
      content: input,
      mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      option,
    }; // Only add `option` if it's truthy

    mutation.mutate(payload, {
      onSuccess: () => {
        editor?.commands.clearContent();
        resetMediaUploads();
        setTitle("");
      },
    });
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    handleFileSelection(files);
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelection(files: File[]) {
    if (attachments.length >= 10) {
      toast.error("10 PDFs sont autorisés dans un seul post au maximum.");
      return;
    }

    startUpload(files);

    // Automatically set the title for PDFs if the title is still empty
    if (files.length > 0 && title.trim() === "") {
      const fileName = files[0].name.replace(/\.[^/.]+$/, ""); // Remove file extension
      setTitle(fileName);
    }
  }

  return (
    <div className="flex flex-col border-b gap-5 pt-8 mb-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between px-4 items-center gap-5">
        <h2 className="col-span-2">Titre</h2>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-8/12 py-6 pl-3" // Ensure this matches the EditorContent width
          placeholder="Entrez un titre"
        />
      </div>
      {isPdf ? (
        <div
          {...rootProps}
          className={`w-[90vw]  ${
            isDragActive && "outline-dashed outline-blue-300"
          }`}
        >
          <UploadButton
            className="w-[90vw] mx-auto h-[10rem] border-2 block"
            endpoint="attachment_pdf"
            onChange={handleFileSelection}
            disabled={attachments.length >= 10}
            appearance={{
              button:
                "text-black dark:text-primary mb-2 border-blue-200 dark:border-blue-300 border-2 hover:cursor-pointer",
            }}
          />
        </div>
      ) : (
        <div {...rootProps} className="flex items-center justify-between">
          <h2 className="">Description</h2>
          <div className="w-8/12">
            {" "}
            {/* Ensure this matches the Input width */}
            <EditorContent
              editor={editor}
              className={cn(
                "border-2 overflow-y-auto rounded-2xl bg-background px-5 py-3 w-full", // Add w-full to ensure full width
                isDragActive && "outline-dashed"
              )}
              onPaste={onPaste}
            />
          </div>
          {/* hidden is included in getInputProps */}
          <input {...getInputProps()} />
        </div>
      )}
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
          afterRemoveAttachment={() => setTitle("")}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && !isPdf && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        {!isPdf && (
          <AddAttachmentsButton
            onFilesSelected={handleFileSelection}
            disabled={isUploading || attachments.length >= 10}
          />
        )}
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!canSubmit || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
  afterRemoveAttachment?: (mediaId: string) => void;
  afterRemoveAttachment2?: (title: string) => void;
}

export function AttachmentPreviews({
  attachments,
  removeAttachment,
  afterRemoveAttachment,
  afterRemoveAttachment2,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((attachment) => {
        return (
          <AttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={() => {
              removeAttachment(attachment.file.name);
              if (afterRemoveAttachment) {
                afterRemoveAttachment("");
              }
              if (afterRemoveAttachment2) {
                afterRemoveAttachment2("");
              }
            }}
          />
        );
      })}
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file); // Generate a URL for the file

  return (
    <div
      className={cn(
        "relative mx-auto size-fit",
        isUploading && "opacity-50",
        "bg-background p-3 rounded-lg border border-dashed"
      )}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-xl border-2 border-gray-300"
        />
      ) : (
        <a
          className="flex space-x-3 items-center text-purple-600 hover:text-purple-800"
          target="_blank"
          href={src}
        >
          <FileText size={20} className="text-purple-600" />
          <span className="text-sm font-medium">View PDF</span>
        </a>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
