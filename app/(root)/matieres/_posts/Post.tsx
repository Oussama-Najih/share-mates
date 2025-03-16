import UserAvatar from "@/components/user/UserAvatar";
import { PostData } from "@/index/prisma/types";
import { formatRelativeDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "@/components/Utils/DeleteButton";

export default function Post({
  post,
  userId,
}: {
  post: PostData;
  userId: string;
}) {
  return (
    <article
      className="p-3 space-y-1 max-w-[480px] dark:border-blue-950 w-[70%] mx-auto rounded-md border-2 border-primary/40 bg-card shadow-sm"
      key={post.id}
    >
      <section className="flex relative items-center border-b-2 pb-2 gap-10 font-roboto">
        <UserAvatar avatarUrl={post.author.image} />
        <div className="flex flex-col items-start">
          <p className="text-muted-foreground">@{post.author.name}</p>
          <Link
            href={`post/${post.id}`}
            className="hover:underline text-blue-500 font-roboto text-sm md:text-md"
          >
            {formatRelativeDate(post.createdAt)}
          </Link>
        </div>
      </section>
      <h1 className="text-center pb-2 border-b-2 text-base lg:text-xl">
        {post.title}
      </h1>
      {post.attachment[0].type === "IMAGE" && (
        <Image
          src={post.attachment[0].url}
          alt={post.title}
          width={350}
          height={300}
          className="w-full aspect-video object-cover"
        />
      )}
      <footer className="flex pt-2 justify-between items-center">
        <Link
          href={`post/${post.id}`}
          className="hover:underline text-blue-500 font-roboto text-sm md:text-md"
        >
          {post.content
            ? post.content.slice(0, 10) +
              (post.content.length > 10 ? "..." : "")
            : "No description"}
        </Link>
        {post.authorId === userId ? (
          <DeleteButton
            post={post}
            className="absolute right-2 transition-opacity"
          />
        ) : null}
      </footer>
    </article>
  );
}
