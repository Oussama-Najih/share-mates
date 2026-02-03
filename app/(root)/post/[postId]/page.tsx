import { prisma } from "@/db/prisma";
import { getPostDataInclude, PostData } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, use } from "react";
import Image from "next/image";
import Help from "./Help";
import { auth } from "@/auth";
import UserAvatar from "@/components/user/UserAvatar";
import PostEditableInput from "@/components/form/PostEditInput";
import ScrollToComment from "./ScrollToComment";
import AuthorName from "./AuthorName";

interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const user = await getServerUser();
  const { postId } = await params;

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.author.name}: ${post.content?.slice(0, 50)}...`,
  };
}

export default async function Page({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const { user } = session;
  const { postId } = await params;
  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full lg:max-w-5xl flex-col items-center py-2 px-1 gap-5">
      <ScrollToComment />
      <section className="flex w-full justify-center items-center gap-14 border-b-2">
        <AuthorName postAuthorId={post.author.id} name={post.author.name} />
        <UserAvatar
          userId={post.author.id}
          avatarUrl={post.author.image}
          size={250}
          className="size-full max-h-60 max-w-60 rounded-full"
        />
      </section>
      {post.authorId === user.id ? (
        <PostEditableInput
          isTitle={true}
          initialValue={post.title}
          postId={post.id}
        />
      ) : (
        <h1 className="text-xl font-roboto md:text:2xl">{post.title}</h1>
      )}

      {post.attachment.length > 0 ? (
        post.attachment[0].type === "IMAGE" ? (
          <div className="sm:grid gap-2">
            {post.attachment.map((attachment, index) => (
              <a key={index} href={attachment.url}>
                <Image
                  src={attachment.url}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="w-full object-cover rounded-md"
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {post.attachment.map((attachment, index) => (
              <a
                key={index}
                target="_blank"
                href={attachment.url}
                className="inline-block text-black text-sm md:text-md"
              >
                <div className="h-[300px] aspect-square flex items-center justify-center bg-[url('/images/pdf_image.png')] bg-center bg-cover">
                  {attachment.originalFileName}
                </div>
              </a>
            ))}
          </div>
        )
      ) : (
        <p className="text-gray-500">No attachments available</p>
      )}

      <div className="flex px-2 items-center font-roboto w-full text-center pb-3 border-b-2 text-md gap-5 justify-center">
        {post.authorId === user.id ? (
          <PostEditableInput
            initialValue={
              post.content || "L'auteur n'a ajouté aucune description."
            }
            postId={postId}
          />
        ) : (
          <h1 className="text-xl font-roboto md:text:2xl">
            {post.content || "L'auteur n'a ajouté aucune description."}
          </h1>
        )}
      </div>

      <div>
        {post.category}
        <span className="mx-2">|</span>
        {post.subject}
      </div>

      <Help post={post} userId={user.id} />
    </main>
  );
}
