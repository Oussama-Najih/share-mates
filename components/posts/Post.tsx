import UserAvatar from "@/components/user/UserAvatar";
import { PostData } from "@/index/prisma/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Comments from "../comments/Comments";
import CommentCount from "../../app/(root)/post/[postId]/CommentCount";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import DeleteButton from "./DeleteButton";
import { Media } from "@prisma/client";
import PostSmoothEditInput from "../form/PostSmoothEditInput";
import LikeButton from "../comments/LikeButton";

export default function Post({
  post,
  userId,
}: {
  post: PostData;
  userId: string;
}) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article
      className="p-3 space-y-1 max-w-[480px] dark:border-blue-950 w-[70%] mx-auto rounded-md border-2 border-primary/40 bg-card shadow-sm relative"
      key={post.id}
    >
      <section className="flex relative items-center border-b-2 pb-2 gap-10 font-roboto">
        <UserAvatar avatarUrl={post.author.image} />
        <div className="flex flex-col items-start">
          <p className="text-muted-foreground">@{post.author.name}</p>
          <h2 className=" text-blue-500 font-roboto text-sm md:text-md relative z-20">
            {formatRelativeDate(post.createdAt)}
          </h2>
        </div>
      </section>

      <PostSmoothEditInput
        initialValue={post.title}
        isTitle={true}
        postId={post.id}
        canEdit={post.authorId === userId}
      />

      {!!post.attachment.length && (
        <MediaPreviews postId={post.id} attachments={post.attachment} />
      )}

      <footer className="flex pt-2 justify-between items-center">
        <PostSmoothEditInput
          initialValue={
            post.content
              ? post.content.slice(0, 10) +
                (post.content.length > 10 ? "..." : "")
              : "Pas de description"
          }
          postId={post.id}
          canEdit={post.authorId === userId}
          className="font-roboto text-sm md:text-md"
        />
        <div className="flex relative items-end gap-4">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post.likes.length,
              isLikedByUser: post.likes.some((like) => like.userId === userId),
            }}
          />
          {post.authorId === userId ? (
            <DeleteButton post={post} className="absolute transition-opacity" />
          ) : null}
        </div>
      </footer>

      <div className="rounded-lg mt-2 w-full relative z-20">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent article click
            setShowComments((prev) => !prev);
          }}
          className="flex items-center gap-2 mb-3"
        >
          <MessageSquare className="size-5" />
          <CommentCount postId={post.id} initialState={post.comments.length} />
        </button>
        {showComments ? (
          <Comments userId={userId} postId={post.id} parentId={null} />
        ) : null}
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
  postId: string;
}

function MediaPreviews({ attachments, postId }: MediaPreviewsProps) {
  return (
    <Link
      href={`post/${postId}`}
      className={cn(
        "overflow-hidden pr-2",
        attachments.length > 1 && "grid gap-4 md:justify-center md:grid-cols-2 "
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </Link>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <div className="relative w-full h-60 sm:h-72 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
        <Image
          src={media.url}
          alt="Attachment"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
    );
  } else if (media.type === "PDF") {
    return (
      <div className="inline-block text-blue-500 text-sm md:text-md w-full max-w-full">
        <div className="h-[200px] aspect-square  w-full md:h-[300px] md:aspect-[3/4] flex items-center justify-center bg-[url('/images/pdf_image.png')] bg-center bg-cover rounded-lg overflow-hidden">
          <span className="text-black font-semibold">
            {media.originalFileName}
          </span>
        </div>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
