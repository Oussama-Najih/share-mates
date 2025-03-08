import { prisma } from "@/db/prisma";
import { getPostDataInclude, PostData } from "@/index/prisma/types";
import { getServerUser } from "@/lib/serverFuncs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, useState } from "react";
import Image from "next/image";
import Help from "./Help";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ postId: string }>;
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
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

  //Normally they should not see this ever because we check login in layout, but we still have to handle null case

  const post = await getPost(postId, user.id);

  return (
    <main className="flex flex-col items-center w-9/12 max-w-xl py-2 px-1 mx-auto min-w-0 gap-5">
      <Image
        src={post.attachment[0].url}
        alt={post.title}
        width={350}
        height={300}
        className="w-full aspect-video object-cover rounded-md"
      />
      {post.content ? (
        <h2>{post.content}</h2>
      ) : (
        <h1 className="font-roboto text-xl">
          <span className="text-blue-500">@{post.author.name}</span> didnt add
          any description
        </h1>
      )}
      <SessionProvider session={session}>
        <Help post={post} />
      </SessionProvider>
    </main>
  );
}
