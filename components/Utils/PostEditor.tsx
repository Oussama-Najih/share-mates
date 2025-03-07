"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useRef, useState } from "react";
import "./postEditor.css";
import LoadingButton from "../form/LoadingButton";
import { useSession } from "next-auth/react";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { TextField } from "@mui/material";
import { sx2 } from "@/CSS_Configs/mui";
import { useSubmitPostMutation } from "@/lib/mutations/post.mutations";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

export default function PostEditor() {
  const { theme } = useTheme();

  const { data } = useSession();

  if (!data) throw new Error("Not authorized");

  const { user } = data;

  const [title, setTitle] = useState("");

  const searchParams = useSearchParams();
  const matiere = searchParams.get("matiere") as string;
  const categorie = searchParams.get("categorie") as string;

  const mutation = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  //Don't want to trigger file input onClick
  const { onClick, ...rootProps } = getRootProps();

  const canSubmit = title.length >= 3 && !!attachments.length;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Add a note to your post !",
      }),
    ],
    // editorProps: {
    //   attributes: {
    //     SpellCheck: "false",
    //   },
    // },
    immediatelyRender: false, // ✅ Fix hydration mismatch
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        matiere,
        categorie,
        title,
        content: input,
        mediaId: attachments[0].mediaId!,
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      }
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <div className="flex flex-col border-b gap-5 pt-8 mb-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="grid grid-cols-5 px-4 items-center gap-5">
        <h2 className="col-span-2"> Title</h2>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="col-span-3 px-[2px] text-white"
          placeholder="Enter your title here"
          sx={sx2(theme!)}
        />
        <h2 className="col-span-2">Content</h2>
        <div {...rootProps} className="col-span-3">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] col-span-3 border-2 w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed"
            )}
            onPaste={onPaste}
          />
          {/* hidden is included in getInputProps */}
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 1}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!canSubmit || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
      <h1>{String(isUploading)}</h1>
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
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            // By resetting e.target.value, you force the input field to recognize a new change, even if the user picks the same file(s).
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
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
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      <Image
        src={src}
        alt="Attachment preview"
        width={500}
        height={500}
        className="size-fit max-h-[30rem] rounded-2xl"
      />
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
