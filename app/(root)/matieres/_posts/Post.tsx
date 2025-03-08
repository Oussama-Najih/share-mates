import UserAvatar from "@/components/user/UserAvatar";
import { PostData } from "@/index/prisma/types";
import Image from "next/image";
import Link from "next/link";

export default function Post({ post }: { post: PostData }) {
  return (
    <article
      className="space-y-3 max-w-[480px] dark:border-blue-950 w-[70%] mx-auto py-2 px-1 rounded-md border-2 border-primary/40 bg-card shadow-sm"
      key={post.id}
    >
      <section className="flex items-center gap-10 font-roboto">
        <UserAvatar avatarUrl={post.author.image} />
        <div className="flex flex-col items-start">
          <p className="text-muted-foreground">@{post.author.name}</p>
          <Link
            href={`post/${post.id}`}
            className="dark:text-blue-400 hover:underline text-blue-600"
          >
            {post.title}
          </Link>
        </div>
      </section>
      <Image
        src={post.attachment[0].url}
        alt={post.title}
        width={350}
        height={300}
        className="w-full aspect-video object-cover"
      />
    </article>
  );
}
